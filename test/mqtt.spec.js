'use strict'

const path = require('path')
const test = require('japa')
const {ioc} = require('@adonisjs/fold')
const {Config, Helpers} = require('@adonisjs/sink')
const Mqtt = require('../src/Mqtt/Mqtt')

const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const mqttPort = 8273

test.group('Scheduler', (group) => {
  /**
   * @param {String} name
   * @return {Helpers}
   */
  function getHelpers (name) {
    ioc.fake('Adonis/Src/Helpers',
      () => new Helpers(path.join(__dirname, `./projects/${name}`)))
    return ioc.use('Adonis/Src/Helpers')
  }

  function getConfig () {
    let config = new Config()
    config.set('mqtt.host', 'localhost')
    config.set('mqtt.port', mqttPort)
    config.set('mqtt.username', 'test')
    config.set('mqtt.password', 'test')
    return config
  }

  function getEvent () {
    ioc.fake('Adonis/Src/Event', () => {
      return {
        fire: () => {}
      }
    })
    return ioc.use('Adonis/Src/Event')
  }

  group.before((done) => {
    ioc.fake('MqttListener', () => require('./../src/Mqtt/MqttListener'))

    server.listen(mqttPort, function () {
      console.log('server listening on port', mqttPort)
      done()
    })
  })

  test('Should instantiate correctly', (assert) => {
    const Helpers = getHelpers('good')
    const Config = getConfig()
    const Event = getEvent()
    const mqtt = new Mqtt(Event, Config, Helpers)

    assert.equal(mqtt.listeners.length, 1)
    assert.equal(mqtt.listeners[0].subscription, 'mock/example/+')

    return new Promise((resolve) => {
      mqtt.listeners[0].handleMessage = (message, matchedWildcards) => {
        assert.deepEqual(matchedWildcards, ['one'])
        resolve()
      }

      setTimeout(() => {
        aedes.publish({
          cmd: 'publish',
          qos: 2,
          topic: 'mock/example/one',
          payload: Buffer.from('test'),
          retain: false
        })
      }, 500)
    })
  })

  test('Should send matching message to listener', (assert) => {
    const Helpers = getHelpers('good')
    const Config = getConfig()
    const Event = getEvent()
    const mqtt = new Mqtt(Event, Config, Helpers)

    return new Promise((resolve, reject) => {
      mqtt.listeners[0].handleMessage = (message, matchedWildcards) => {
        assert.equal(message, 'test')
        assert.deepEqual(matchedWildcards, ['one'])
        resolve()
      }

      setTimeout(() => {
        aedes.publish({
          cmd: 'publish',
          qos: 2,
          topic: 'mock/example/one',
          payload: Buffer.from('test'),
          retain: false
        })
      }, 100)
    })
  })

  test('Should skip non-matching message to listener', (assert, done) => {
    const Helpers = getHelpers('good')
    const Config = getConfig()
    const Event = getEvent()
    const mqtt = new Mqtt(Event, Config, Helpers)

    mqtt.listeners[0].handleMessage = (message, matchedWildcards) => {
      done(new Error())
    }

    setTimeout(() => {
      aedes.publish({
        cmd: 'publish',
        qos: 2,
        topic: 'mock/example2/one',
        payload: Buffer.from('test'),
        retain: false
      })
    }, 100)

    setTimeout(() => {
      // If no message arrived in 500ms, we can be sure it did not match
      done()
    }, 500)
  })

  test('Should skip instantiation of listener with bad subscription', (assert) => {
    const Helpers = getHelpers('bad')
    const Config = getConfig()
    const Event = getEvent()
    const mqtt = new Mqtt(Event, Config, Helpers)

    assert.equal(mqtt.listeners.length, 0)
  })

  test('Should skip instantiation of empty listener file', (assert) => {
    const Helpers = getHelpers('bad_two')
    const Config = getConfig()
    const Event = getEvent()
    const mqtt = new Mqtt(Event, Config, Helpers)

    assert.equal(mqtt.listeners.length, 0)
  })
})
