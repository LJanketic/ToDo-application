import 'reflect-metadata';
import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import { initializeDependencyInjection } from './config/dependency-injection/dependency-injection';
import config, { Config } from './config/validation';

const { server: serverConfig }: Config = config(process.env);
const app = express();
const port = serverConfig.port ?? '3000';

export const init = async (): Promise<void> => {
  try {
    await initializeDependencyInjection(app);

    app.listen(port, () => {
      console.log(`Application running on: http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start the application:', error);
  }
};

init();
