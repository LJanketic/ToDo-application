import { PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

abstract class BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}

export default BaseEntity;
