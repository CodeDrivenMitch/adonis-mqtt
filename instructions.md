# Configuration

## Registering provider
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

Add your configuration to the `.env` file, and/or the config/mqtt.js file so MQTT knows where and how to connect

```
MQTT_HOST=yourmqtthost.com
MQTT_PORT=10444
MQTT_USERNAME=username123
MQTT_PASSWORD=password123#
```

# Usage

We have to `use` Mqtt somewhere so it gets initialized. I prefer it in the `app.events.js` file, since all event-related stuff is defined there. 
This is only needed if you do not use it anywhere else (for example when sending messages).

```js
const Event = use('Event');
const Mqtt = use('Mqtt');
   
// Listen to some Events of the library
Event.on('MQTT:Connected', 'Message.connected')
Event.on('MQTT:Disconnected', 'Message.disconnected')
```

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
