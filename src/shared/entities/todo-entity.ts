import { Entity, Property } from '@mikro-orm/core';
import BaseEntity from './base-entity';

@Entity()
class ToDoEntity extends BaseEntity {
  @Property()
  text!: string;

  @Property()
  done!: boolean;
}

export default ToDoEntity;
