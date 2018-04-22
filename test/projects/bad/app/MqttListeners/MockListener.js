const MqttListener = use('MqttListener')

class MockListener extends MqttListener {

  async handleMessage (message, matchedWildcards) {
  }
}

module.exports = MockListener
