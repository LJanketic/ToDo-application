import joi from 'joi';

export interface ServerConfig {
  port: number;
  frontendURI: string;
  smsSender: string;
  smsDestination: string;
  smsHost: string;
  smsKey: string;
}

const schema = joi.object({
  port: joi.number().port().default(3000),
  frontendURI: joi.string(),
  smsSender: joi.string(),
  smsDestination: joi.string(),
  smsHost: joi.string(),
  smsKey: joi.string(),
});

const createConfig = (env: any): ServerConfig => ({
  port: env.PORT,
  frontendURI: env.FRONTEND_URI,
  smsSender: env.SMS_FROM,
  smsDestination: env.SMS_DESTINATION,
  smsHost: env.SMS_HOSTNAME,
  smsKey: env.SMS_KEY,
});

export default (env: any): ServerConfig =>
  joi.attempt(createConfig(env), schema);
