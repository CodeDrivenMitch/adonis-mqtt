'use strict'

const path = require('path')

module.exports = async function (cli) {
  try {
    await cli.makeConfig('mqtt.js', path.join(__dirname, './templates/config.js'))
    cli.command.completed('create', 'config/mqtt.js')

    let fs = require('fs');
    let dir = path.join(__dirname, './app/MqttListeners');

    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
      cli.command.completed('created directory', 'app/MqttListeners')
    }
  } catch (error) {
    // ignore errors
  }
}
