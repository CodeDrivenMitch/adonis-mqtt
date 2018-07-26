'use strict'

const path = require('path')
const fs = require('fs')

module.exports = async function (cli) {
  try {
    await cli.makeConfig('mqtt.js', path.join(__dirname, './templates/config.js'))
    cli.command.completed('create', 'config/mqtt.js')


    let dir = path.join(cli.appDir, './MqttListeners');
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
      cli.command.completed('created directory', 'app/MqttListeners')
    }
  } catch (error) {
    console.log(error)
    // ignore errors
  }
}
