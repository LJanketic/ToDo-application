import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base-entity';

@Entity()
export class ToDoEntity extends BaseEntity {
  @Property()
  text: string;

  @Property()
  done: boolean;

  constructor(text: string, done: boolean = false) {
    super();
    this.text = text;
    this.done = done;
  }
}
