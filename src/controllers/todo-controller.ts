import { Request, Response, NextFunction } from 'express';
import { DependencyInjection } from '../config/dependency-injection/dependency-injection';
import { ToDoEntity } from '../shared/entities';
import sendSMS from '../services/sms-service';
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../utils/custom-errors';
import { ERROR_MESSAGES } from '../utils/error-strings';

function mapSortOrder(sort: string): 'ASC' | 'DESC' {
  if (!sort) return 'DESC';

  const sortValue = sort.toUpperCase();
  if (sortValue === 'ASC' || sortValue === 'DESC') {
    return sortValue as 'ASC' | 'DESC';
  }

  return 'DESC';
}

const ToDoController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sort } = req.query;
      const sortOrder = mapSortOrder(sort as string);
      const fetchedTodos = await DependencyInjection.todos.findAll({
        orderBy: { createdAt: sortOrder as 'ASC' | 'DESC' },
      });

      res.status(200).json(fetchedTodos);
    } catch (error) {
      next(new InternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR));
    }
  },

  async getOneById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const fetchedTodo = await DependencyInjection.todos.findOne(id);

      if (!fetchedTodo) {
        throw new NotFoundError(ERROR_MESSAGES.TO_DO_NOT_FOUND(id));
      }

      res.status(200).json(fetchedTodo);
    } catch (error) {
      next(error);
    }
  },

  async createOne(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { text } = req.body;

      if (!text) {
        throw new BadRequestError(ERROR_MESSAGES.TEXT_FIELD_REQUIRED);
      }

      const createdToDo = new ToDoEntity(text);
      await DependencyInjection.em.persistAndFlush(createdToDo);

      res.status(201).json(createdToDo);
    } catch (error) {
      next(error);
    }
  },

  async updateOne(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { text, done } = req.body;

      const fetchedTodo = await DependencyInjection.todos.findOne(id);

      if (!fetchedTodo) {
        throw new NotFoundError(ERROR_MESSAGES.TO_DO_NOT_FOUND(id));
      }

      fetchedTodo.text = text ?? fetchedTodo.text;
      fetchedTodo.done = done ?? fetchedTodo.done;

      await DependencyInjection.em.flush();

      if (done) {
        sendSMS(text);
      }

      res.status(200).json(fetchedTodo);
    } catch (error) {
      next(error);
    }
  },

  async deleteOne(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const fetchedTodo = await DependencyInjection.todos.findOne(id);

      if (!fetchedTodo) {
        throw new NotFoundError(ERROR_MESSAGES.TO_DO_NOT_FOUND(id));
      }

      await DependencyInjection.em.removeAndFlush(fetchedTodo);

      res.status(204).end();
    } catch (error) {
      next(error);
    }
  },
};

export default ToDoController;
