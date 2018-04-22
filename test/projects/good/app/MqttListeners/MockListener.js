const MqttListener = use('MqttListener')

class MockListener extends MqttListener {
  get subscription () {
    return 'mock/example/+'
  }

  async handleMessage (message, matchedWildcards) {
  }
}

module.exports = MockListener
