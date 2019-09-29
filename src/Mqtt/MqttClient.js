"use strict";

const mqtt = require("mqtt");
const mqttWildcard = require("mqtt-wildcard");
const debug = require("debug")("adonis:mqtt");

class Mqtt {
  /**
   * @return {Array}
   */
  static get inject() {
    return ["Adonis/Src/Event", "Adonis/Src/Config", "Adonis/Src/Helpers"];
  }

  constructor(Event, Config, Helpers) {
    if (Helpers.isAceCommand()) {
      debug("MQTT not booting since execution is an ACE command");
      return;
    }

    this.Event = Event;
    this.Helpers = Helpers;
    this.Config = Config;
    this.listeners = [];

    this.Event.fire("MQTT:Initializing");
    this._createClient();

    this.Event.fire("MQTT:Initialized");
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
    return new Promise(resolve => {
      this.client.publish(topic, message, opts, resolve);
    });
  }

  _handleConnect() {
    debug("Mqtt client connected");
    this.Event.fire("MQTT CLIENT:Connected");
  }

  _handleDisconnect() {
    debug("Mqtt client disconnected");
    this.Event.fire("MQTT CLIENT:Disconnected");
  }

  _handleMessage(topic, message) {
    debug("Mqtt message received on topic %s: %s", topic, message.toString());
    for (const listener of this.listeners) {
      const matchedWildcards = mqttWildcard(topic, listener.subscription);

      if (matchedWildcards) {
        debug(
          "Found matching listener with subscription %s",
          listener.subscription
        );
        listener.handleMessage(message.toString(), matchedWildcards);
      }
    }
  }

  _createClient() {
    if (!this.Config.get("mqtt.aws.endpoint")) {
      this.client = mqtt.connect(
        `mqtt://${this.Config.get("mqtt.host")}:${this.Config.get(
          "mqtt.port"
        )}`,
        {
          username: this.Config.get("mqtt.username"),
          password: this.Config.get("mqtt.password")
        }
      );
    } else {
      const signUrl = require("aws-device-gateway-signed-url");
      const endpoint = `${this.Config.get(
        "mqtt.aws.endpoint"
      )}.iot.${this.Config.get("mqtt.aws.regionName")}.amazonaws.com`;
      this.client = mqtt.connect(`wss://${endpoint}/mqtt`, {
        transformWsUrl: () => {
          return signUrl({
            ...this.Config.get("mqtt.aws"),
            endpoint: endpoint
          });
        }
      });
    }

    this.client.on("connect", this._handleConnect.bind(this));
    this.client.on("offline", this._handleDisconnect.bind(this));
    this.client.on("close", this._handleDisconnect.bind(this));
    this.client.on("end", this._handleDisconnect.bind(this));
    this.client.on("message", this._handleMessage.bind(this));
  }
}

module.exports = Mqtt;
