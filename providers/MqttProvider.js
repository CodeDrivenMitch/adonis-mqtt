'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class MqttProvider extends ServiceProvider {
  _registerMqtt () {
    this.app.singleton('Insidion/Mqtt', () => make(require('./../src/Mqtt/Mqtt')))
    this.app.alias('Insidion/Mqtt', 'Mqtt')
  }

  _registerTask () {
    this.app.bind('Insidion/MqttListener', () => require('./../src/Mqtt/MqttListener'))
    this.app.alias('Insidion/MqttListener', 'MqttListener')
  }

  _registerMqttClient() {
    this.app.singleton("Insidion/MqttClient", () =>
      make(require("./../src/Mqtt/MqttClient"))
    );
    this.app.alias("Insidion/MqttClient", "MqttClient");
  }

  register () {
    this._registerTask()
    this._registerMqtt()
    this._registerMqttClient()
  }
}

module.exports = MqttProvider
