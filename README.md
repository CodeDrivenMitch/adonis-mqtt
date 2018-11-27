# Adonis MQTT Integration

[![Coverage Status](https://coveralls.io/repos/github/Morlack/adonis-mqtt/badge.svg?branch=master)](https://coveralls.io/github/Morlack/adonis-mqtt?branch=master)
[![Build status](https://ci.appveyor.com/api/projects/status/ox5qs72l40kxci34/branch/master?svg=true)](https://ci.appveyor.com/project/Morlack/adonis-mqtt/branch/master)

Adonis-mqtt is a provider to integrate MQTT in your app. This is useful when developing an IOT application, or need a simple message broker.

## Features
- MQTT Connection using mqtt.js
- Easy integration with MqttListener classes
- Included CLI generator for MqttListener classes

## Roadmap
These are the features that I still want to developing in the near future.

- Check SSL support (currently untested)
- Improve tests and documentation

## Usage

```bash
npm install adonis-mqtt
```

To use adonis-mqtt, add the following to your providers:

```js

// Add the mqtt provider
const providers = [
  // ...
  'adonis-mqtt/providers/MqttProvider',
]

// ...
// Add the command provider
const aceProviders = [
  // ...
  'adonis-mqtt/providers/CommandsProvider',
]
```

Then we'll have to `use` Mqtt somewhere so it gets initialized. I prefer it in the `app.events.js` file, since all event-related stuff is defined there. 
This is only needed if you do not use it anywhere else (for example when sending messages).

```js
const Event = use('Event');
const Mqtt = use('Mqtt');
   
// Listen to some Events of the library
Event.on('MQTT:Connected', 'Message.connected')
Event.on('MQTT:Disconnected', 'Message.disconnected')
```

Add new config file into folder config, let's say we have file `mqtt.js` then add code below.

```js
const Env = use('Env')

module.exports = {
  url: Env.get('MQTT_URL'),
  username: Env.get('MQTT_USERNAME', ''),
  password: Env.get('MQTT_PASSWORD', '')
}
```

Lastly we should add some configuration to the `.env` file so MQTT knows where and how to connect

```
MQTT_URL=wss://yourmqtthost.com:10444/path
MQTT_USERNAME=username123
MQTT_PASSWORD=password123#
```

Now adonis-mqtt is ready for use. 

## Sending messages

Sending messages through your MQTT server is very easy.

```js
const Mqtt = use('Mqtt');

class SomeController {
  async index() {
    await Mqtt.sendMessage('mytopic', 'My Message', {qos: 1})
  }
}

```

## Listeners
You can define multiple MqttListeners, which the provider will automatically pick up on boot.

You can generate a listener by using the adonis cli:

```bash
adonis make:mqtt-listener Test
```

This command will generate a listener class called TestMqttListener.

MqttListeners should are defined in the `app/MqttListeners` folder and should have the following base content:

```js
const MqttListener = use('MqttListener')

class MockListener extends MqttListener {
  /*
   * Subscription string. Uses the MQTT wildcard format.
   */
  get subscription () {
    return 'my/+/example/mqtt/string/#'
  }

  /**
  * Message handler is passed the String data of the message and the matched wildcard values
  */
  async handleMessage (message, wildcardMatches) {
  }
}

module.exports = MockListener

```

## Contributing
You are free to contribute, make pull requests and create issues. 

I will work on this project in my free time and will be using it to build my own home automation system. 

## Special Thanks

The code of [adonis-scheduler](https://github.com/nrempel/adonis-scheduler/) was a great example in many ways. This helped me tremendously. 
