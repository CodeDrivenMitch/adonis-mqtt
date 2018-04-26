'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class CommandsProvider extends ServiceProvider {
  /**
   * Registers providers for all the migration related
   * commands
   *
   * @method _registerCommands
   *
   * @return {void}
   */
  _registerCommands () {
    this.app.bind('Adonis/Commands/Make:MqttListener', () => require('../src/Commands/Make/MqttListener'))
  }

  /**
   * Register all the required providers
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this._registerCommands()
  }

  /**
   * On boot add commands with ace
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
    const ace = require('@adonisjs/ace')
    ace.addCommand('Adonis/Commands/Make:MqttListener')
  }
}

module.exports = CommandsProvider
