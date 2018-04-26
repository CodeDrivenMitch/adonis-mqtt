'use strict'

/**
 * adonis-commands
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const BaseGenerator = require('./Base')

class MqttListenerGenerator extends BaseGenerator {
  /**
   * returns signature to be used by ace
   * @return {String}
   *
   * @public
   */
  static get signature () {
    return 'make:mqtt-listener {name}'
  }

  /**
   * returns description to be used by ace as help command
   * @return {String}
   *
   * @public
   */
  static get description () {
    return 'Create a new MQTT listener'
  }

  /**
   * handle method will be executed by ace. Here we
   * create the controller to controller directory.
   * @param  {Object} args
   * @param  {Object} options
   *
   * @public
   */
  async handle ({ name }) {
    try {
      await this.ensureInProjectRoot()
      await this.generateBlueprint('mqttListener', name)
      process.exit(0)
    } catch ({ message }) {
      this.error(message)
      process.exit(1)
    }
  }
}

module.exports = MqttListenerGenerator
