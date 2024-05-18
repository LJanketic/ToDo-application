import { defineConfig } from '@mikro-orm/mongodb';
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter';
import { BaseEntity, ToDoEntity } from './shared/entities';
import config, { Config } from './config';

const { database }: Config = config(process.env);

export default defineConfig({
  entities: [BaseEntity, ToDoEntity],
  dbName: database.dbString,
  highlighter: new MongoHighlighter(),
  debug: true,
});
