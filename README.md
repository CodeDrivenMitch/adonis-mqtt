# Adonis MQTT Integration

**!! UNSUPPORTED NOTICE !!**
I have not worked on this library for quite some time because I have not used Adonis in quite a while. If you'd like to take this library and make it better, send an email to mitchellherrijgers@gmail.com


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

## Installation

```bash
adonis install adonis-mqtt
```

See [instructions.md](instructions.md) for configuration and usage.

## Contributing
You are free to contribute, make pull requests and create issues. 

I will work on this project in my free time and will be using it to build my own home automation system. 

## Special Thanks

The code of [adonis-scheduler](https://github.com/nrempel/adonis-scheduler/) was a great example in many ways. This helped me tremendously. 
