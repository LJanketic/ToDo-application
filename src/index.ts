import 'reflect-metadata';
import express from 'express';
import http from 'http';
import {
  EntityManager,
  EntityRepository,
  MikroORM,
  RequestContext,
} from '@mikro-orm/mongodb';
import * as dotenv from 'dotenv';

import config, { Config } from './config';
import { ToDoEntity } from './shared/entities';
import todoRoutes from './routes/todo-routes';

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

export const init = (async () => {
  DependencyInjection.orm = await MikroORM.init();
  DependencyInjection.em = DependencyInjection.orm.em;
  DependencyInjection.todos =
    DependencyInjection.orm.em.getRepository(ToDoEntity);

  app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

  app.use(express.json());
  app.use((req, res, next) =>
    RequestContext.create(DependencyInjection.orm.em, next)
  );

  app.use('/api', todoRoutes);

  DependencyInjection.server = app.listen(port, () => {
    console.log(`Application running on: http://localhost:${port}`);
  });
})();
