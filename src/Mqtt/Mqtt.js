'use strict'

const mqtt = require('mqtt')
const mqttWildcard = require('mqtt-wildcard')
const fs = require('fs')
const path = require('path')
const debug = require('debug')('adonis:mqtt')
const {ioc} = require('@adonisjs/fold')

class Mqtt {
  /**
   * @return {Array}
   */
  static get inject () {
    return ['Adonis/Src/Event', 'Adonis/Src/Config', 'Adonis/Src/Helpers']
  }

  constructor (Event, Config, Helpers) {
    if(Helpers.isAceCommand()) {
      debug('MQTT not booting since execution is an ACE command')
      return
    }

    this.Event = Event
    this.Helpers = Helpers
    this.Config = Config
    this.listeners = []

    this.Event.fire('MQTT:Initializing')
    this._createClient()

    this._configureListenersPath()
    this._registerListeners()
    this.Event.fire('MQTT:Initialized')
  }

  /**
   * publish - publish <message> to <topic>
   *
   * @param {String} topic - topic to publish to
   * @param {(String|Buffer)} message - message to publish
   *
   * @param {Object}    [opts] - publish options, includes:
   *   @param {Number}  [opts.qos] - qos level to publish on
   *   @param {Boolean} [opts.retain] - whether or not to retain the message
   *
   * @returns {Promise} Result of publish
   *
   * @example await Mqtt.sendMessage('test/topic', 'This is a message')
   * @example await Mqtt.sendMessage('test/topic', 'This is a message', {qos: 2})
   */
  async sendMessage(topic, message, opts) {
    return new Promise((resolve) => {
      this.client.publish(topic, message, opts, resolve);
    })
  }

  _handleConnect () {
    debug('Mqtt client connected')
    this.Event.fire('MQTT:Connected')
  }

  _handleDisconnect () {
    debug('Mqtt client disconnected')
    this.Event.fire('MQTT:Disconnected')
  }

  _handleMessage (topic, message) {
    debug('Mqtt message received on topic %s: %s', topic, message.toString())
    for (const listener of this.listeners) {
      const matchedWildcards = mqttWildcard(topic, listener.subscription)

      if (matchedWildcards) {
        debug('Found matching listener with subscription %s', listener.subscription)
        listener.handleMessage(message.toString(), matchedWildcards)
      }
    }
  }

  /**
   * Configure tasks absolute path for app
   * /<project-dir>/app/MqttListeners
   *
   * @private
   */
  _configureListenersPath () {
    this.listenersPath = path.join(this.Helpers.appRoot(), 'app',
      'MqttListeners')
    this.listenersPath = path.normalize(this.listenersPath)
  }

  async _registerListeners () {
    debug('Scan tasks path %s', this.listenersPath)
    let taskFiles

    try {
      taskFiles = fs.readdirSync(this.listenersPath)
    } catch (e) {
      // If the directory isn't found, log a message and exit gracefully
      if (e.code === 'ENOENT') {
        throw new Error('MqttListeners folder not found!')
      }

      throw e
    }

    taskFiles = taskFiles.filter(file => path.extname(file) === '.js')

    for (let taskFile of taskFiles) {
      await this._registerListener(taskFile)
    }
  }

  async _registerListener (file) {
    const filePath = path.join(this.listenersPath, file)
    let task
    try {
      task = require(filePath)
    } catch (e) {
      if (e instanceof ReferenceError) {
        debug(
          'Unable to import task class <%s>. Is it a valid javascript class?',
          file)
        return
      } else {
        throw e
      }
    }

    // Get instance of task class
    const taskInstance = ioc.make(task)
    if (!taskInstance.subscription || taskInstance.subscription === '') {
      console.error(`MqttListener ${file} does not have a subscription string!`)
    } else {
      this.client.subscribe(taskInstance.subscription)
      debug('Subscribed to topic %s', taskInstance.subscription)
      this.listeners.push(taskInstance)
    }
  }

  _createClient () {
    if (!this.Config.get('mqtt.aws.endpoint')) {
      this.client = mqtt.connect(
        `mqtt://${this.Config.get('mqtt.host')}:${this.Config.get('mqtt.port')}`,
        {
          username: this.Config.get('mqtt.username'),
          password: this.Config.get('mqtt.password')
        }
      )
    } else {
      const signUrl = require('aws-device-gateway-signed-url')
      const endpoint = `${this.Config.get('mqtt.aws.endpoint')}.iot.${this.Config.get('mqtt.aws.regionName')}.amazonaws.com`
      this.client = mqtt.connect(`wss://${endpoint}/mqtt`,
        {
          transformWsUrl: () => {
            return signUrl({
              ...this.Config.get('mqtt.aws'),
              endpoint: endpoint,
            })
          }
        }
      )
    }

    this.client.on('connect', this._handleConnect.bind(this))
    this.client.on('offline', this._handleDisconnect.bind(this))
    this.client.on('close', this._handleDisconnect.bind(this))
    this.client.on('end', this._handleDisconnect.bind(this))
    this.client.on('message', this._handleMessage.bind(this))
  }
}

module.exports = Mqtt
