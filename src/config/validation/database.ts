import joi from 'joi';

export interface DbConfig {
  dbString: string;
}

const schema = joi
  .object({
    dbString: joi.string().required(),
  })
  .unknown();

const createConfig = (env: any): DbConfig => ({
  dbString: env.DB_STRING,
});

export default (env: any): DbConfig => {
  return joi.attempt(createConfig(env), schema);
};
