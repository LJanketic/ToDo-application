import 'reflect-metadata';
import express from 'express';
import http from 'http';
import {
  EntityManager,
  EntityRepository,
  MikroORM,
  RequestContext,
} from '@mikro-orm/mongodb';
import cors from 'cors';
import * as dotenv from 'dotenv';

import config, { Config } from './config';
import { ToDoEntity } from './shared/entities';
import todoRoutes from './routes/todo-routes';
import { ErrorHandler } from './config/error-handler';

dotenv.config();

export const DependencyInjection = {} as {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
  todos: EntityRepository<ToDoEntity>;
};

const app = express();
const { server: serverConfig }: Config = config(process.env);

const port = serverConfig.port ?? '3000';

const corsOptions = {
  origin: serverConfig.frontendURI ?? 'http://localhost:3000',
  optionSuccessStatus: 200,
};

export const init = (async () => {
  DependencyInjection.orm = await MikroORM.init();
  DependencyInjection.em = DependencyInjection.orm.em;
  DependencyInjection.todos =
    DependencyInjection.orm.em.getRepository(ToDoEntity);

  app.use(cors(corsOptions));

  app.use(express.json());
  app.use((_req, _res, next) =>
    RequestContext.create(DependencyInjection.orm.em, next)
  );

  app.use('/api', todoRoutes);

  app.use(ErrorHandler);

  DependencyInjection.server = app.listen(port, () => {
    console.log(`Application running on: http://localhost:${port}`);
  });
})();
