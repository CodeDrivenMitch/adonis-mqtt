'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class MqttProvider extends ServiceProvider {
  _registerMqtt () {
    this.app.singleton('Insidion/Mqtt', () => make(require('.')))
  }

  _registerTask () {
    this.app.bind('Insidion/MqttListener', () => require('./MqttListener'))
    this.app.alias('Insidion/MqttListener', 'MqttListener')
  }

  register () {
    this._registerTask()
    this._registerMqtt()
  }
}

module.exports = MqttProvider
