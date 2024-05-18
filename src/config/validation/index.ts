import joi from 'joi';

import server, { ServerConfig } from './server';
import database, { DbConfig } from './database';

export interface Config {
  database: DbConfig;
  server: ServerConfig;
}

const schema = joi.object({
  database: joi.object(),
  server: joi.object(),
});

const createConfig = (env: any) => ({
  database: database(env),
  server: server(env),
});

export default (env: any): Config => joi.attempt(createConfig(env), schema);
