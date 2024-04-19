import joi from 'joi';

export interface DbConfig {
  host: string;
  dbName: string;
  user: string;
  password: string;
  port: number;
}

const schema = joi
  .object({
    host: joi.string().required(),
    dbName: joi.string().required(),
    user: joi.string().required(),
    password: joi.string().allow(''),
    port: joi.number().required(),
  })
  .unknown();

const createConfig = (env: any): DbConfig => ({
  host: env.DB_HOST,
  dbName: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  port: env.DB_PORT,
});

export default (env: any): DbConfig => {
  return joi.attempt(createConfig(env), schema);
};
