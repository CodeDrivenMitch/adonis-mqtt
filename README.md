# Adonis MQTT Integration

[![Coverage Status](https://coveralls.io/repos/github/Morlack/adonis-mqtt/badge.svg?branch=master)](https://coveralls.io/github/Morlack/adonis-mqtt?branch=master)

Adonis-mqtt is a provider to integrate MQTT in your app. This is useful when developing an IOT application, or need a simple message broker.

## Features
- MQTT Connection using mqtt.js
- Easy integration with Listener classes

## Roadmap
These are the features that I still want to developing in the near future.

- Easily send MQTT messages
- Check SSL support (currently untested)
- MessageListener generation using ACE
- Improve tests and documentation

## Usage

To use adonis-mqtt, add the folliowing to your providers:

```js

const providers = [
  // ...
  'adonis-mqtt/providers/MqttProvider',
]
```

Then we'll have to `use` Mqtt somewhere so it gets initialized. I prefer it in the `app.events.js` file, since all event-related stuff is defined there. 

```js
const Event = use('Event');
const Mqtt = use('Mqtt');
   
   
Event.on('MQTT:Connected', 'Message.connected')
Event.on('MQTT:Disconnected', 'Message.disconnected')
```

Now adonis-mqtt is ready for use. 
You can define multiple MessageListeners, which the provider will automatically pick up. 

MessageListeners should be defined in the `app/MessageListeners` folder, and should have the following contents:

```js
const MqttListener = use('MqttListener')

class MockListener extends MqttListener {
  /*
   * Subscription string. Follows the MQTT format.
   */
  get subscription () {
    return 'my/+/example/mqtt/string/#'
  }

  /**
  * Message handler is passed the String data of the message and the matched wildcard values
  */
  async handleMessage (message, matchedWildcards) {
  }
}

module.exports = MockListener

```

The latter part will be coveraged by an adonis CLI generator soon. 


## Contributing
You are free to contribute, make pull requests and create issues. 

I will work on this project in my free time and will be using it to build my own home automation system. 
