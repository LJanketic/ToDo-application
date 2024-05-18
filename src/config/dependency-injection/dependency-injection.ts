import http from 'http';
import express from 'express';
import {
  MikroORM,
  EntityManager,
  RequestContext,
  EntityRepository,
} from '@mikro-orm/mongodb';
import cors from 'cors';
import mikroOrmConfig from '../../mikro-orm.config';
import { ToDoEntity } from '../../shared/entities';
import todoRoutes from '../../routes/todo-routes';
import { ErrorHandler } from '../error-handler';
import config, { Config } from '../validation';

export const DependencyInjection = {} as {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
  todos: EntityRepository<ToDoEntity>;
};

const injectConfigs = async (): Promise<void> => {
  DependencyInjection.orm = await MikroORM.init(mikroOrmConfig);
  DependencyInjection.em = DependencyInjection.orm.em;
  DependencyInjection.todos =
    DependencyInjection.orm.em.getRepository(ToDoEntity);
};

const injectMiddleware = (app: express.Application): void => {
  const { server: serverConfig }: Config = config(process.env);

  const corsOptions = {
    origin: serverConfig.frontendURI ?? 'http://localhost:3000',
    optionSuccessStatus: 200,
  };

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use((_req, _res, next) =>
    RequestContext.create(DependencyInjection.orm.em, next)
  );
  app.use('/api', todoRoutes);
  app.use(ErrorHandler);
};

export const initializeDependencyInjection = async (
  app: express.Application
): Promise<void> => {
  try {
    await injectConfigs();
    console.log('Database setup completed successfully');
    injectMiddleware(app);
    console.log('Middleware setup completed successfully');
  } catch (error) {
    console.error('Application initialization failed:', error);
  }
};
