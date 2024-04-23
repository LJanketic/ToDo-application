import joi from 'joi';

export interface ServerConfig {
  port: number;
  frontendURI: string;
}

const schema = joi.object({
  port: joi.number().port().default(3000),
  frontendURI: joi.string(),
});

const createConfig = (env: any): ServerConfig => ({
  port: env.PORT,
  frontendURI: env.FRONTEND_URI,
});

export default (env: any): ServerConfig =>
  joi.attempt(createConfig(env), schema);
