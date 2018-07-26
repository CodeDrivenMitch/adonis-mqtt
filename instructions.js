'use strict'

const path = require('path')

module.exports = async function (cli) {
  try {
    await cli.makeConfig('mqtt.js', path.join(__dirname, './templates/config.js'))
    cli.command.completed('create', 'config/mqtt.js')

    await cli.ensureDir(cli.helpers.appRoot('MqttListeners'));
  } catch (error) {
    // ignore errors
  }
}
