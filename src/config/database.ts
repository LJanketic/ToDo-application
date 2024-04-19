import joi from 'joi';

export interface DbConfig {
  host: string;
  dbName: string;
  user: string;
  password: string;
  type: 'postgresql';
}

const schema = joi
  .object({
    host: joi.string().required(),
    dbName: joi.string().required(),
    user: joi.string().required(),
    password: joi.string().allow(''),
  })
  .unknown();

const createConfig = (env: any): DbConfig => ({
  host: env.DATABASE_HOST,
  dbName: env.DATABASE_NAME,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  type: 'postgresql',
});

export default (env: any): DbConfig => {
  return joi.attempt(createConfig(env), schema);
};
