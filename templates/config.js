'use strict'

const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Host
  |--------------------------------------------------------------------------
  |
  | MQTT host name or IP address
  |
  */
  host: Env.get('MQTT_HOST', 'localhost'),

  /*
  |--------------------------------------------------------------------------
  | Port
  |--------------------------------------------------------------------------
  |
  | MQTT port
  |
  */
  port: Env.get('MQTT_PORT', 1883),

  /*
  |--------------------------------------------------------------------------
  | Port
  |--------------------------------------------------------------------------
  |
  | MQTT port
  |
  */
  username: Env.get('MQTT_USERNAME', 'username123'),

  /*
  |--------------------------------------------------------------------------
  | Port
  |--------------------------------------------------------------------------
  |
  | MQTT port
  |
  */
  password: Env.get('MQTT_PASSWORD', 'password123#'),


  /*
  |--------------------------------------------------------------------------
  | AWS IoT
  |--------------------------------------------------------------------------
  |
  | If we want to use AWS IoT as our MQTT Broker, we need to provide
  | Credentials, aws region, and the iot thing endpoint we wish to use
  | If aws.endpoint_id is populated, this configuration will be leveraged
  | instead of that provided above.
  |
  | To retrieve your aws iot endpoint_id, you can use the aws cli command:
  |     aws iot describe-endpoint --query endpointAddress --output text
  |
  | or, navigate to your IoT "thing" in the AWS console web gui, on the
  | manage tab, click into your thing, and then on its "Interact" tab
  | you will see a section labeled HTTPS displaying a string like this:
  |      xxxxyyyyzzzz.iot.us-east-1.amazonaws.com
  |
  | The "xxxxyyyyzzzz" value is what you want to define here.
  */
  aws: {
    endpoint: Env.get('AWS_IOT_ENDPOINT_ID', null),
    regionName: Env.get('AWS_REGION', 'us-east-1'),
    accessKey: Env.get('AWS_ACCESS_KEY'),
    secretKey: Env.get('AWS_SECRET_KEY'),
    sessionToken: Env.get('AWS_SESSION_TOKEN'), // Optional
    expires: Env.get('AWS_EXPIRE_SECONDS', 86400), // Default is one day
  },
}
