import { defineConfig } from '@mikro-orm/mongodb';
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter';
import { BaseEntity, ToDoEntity } from './shared/entities';

export default defineConfig({
  entities: [BaseEntity, ToDoEntity],
  dbName: 'mikro-orm-express-ts',
  highlighter: new MongoHighlighter(),
  debug: true,
});
