import { Request, Response } from 'express';
import { DependencyInjection } from '..';
import { ToDoEntity } from '../shared/entities';
import sendSMS from './sms-controller';

function mapSortOrder(sort: string): 'ASC' | 'DESC' {
  if (!sort) return 'DESC';

  const sortValue = sort.toUpperCase();
  if (sortValue === 'ASC' || sortValue === 'DESC') {
    return sortValue as 'ASC' | 'DESC';
  }

  return 'DESC';
}

const ToDoController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { sort } = req.query;
      const sortOrder = mapSortOrder(sort as string);
      const fetchedTodos = await DependencyInjection.todos.findAll({
        orderBy: { createdAt: sortOrder as 'ASC' | 'DESC' },
      });

      res.status(200).json(fetchedTodos);
    } catch (error) {
      console.error('Error while fetching all ToDos:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async getOneById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const fetchedTodo = await DependencyInjection.todos.findOne(id);

      if (!fetchedTodo) {
        res.status(404).json({ message: `ToDo ${id} not found` });
        return;
      }

      res.status(200).json(fetchedTodo);
    } catch (error) {
      console.error('Error fetching ToDo by ID:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async createOne(req: Request, res: Response): Promise<void> {
    try {
      const { text, done } = req.body;

      if (!text) {
        res.status(400).json({ message: 'Text field is mandatory!' });
        return;
      }

      const createdToDo = new ToDoEntity(text, done);
      await DependencyInjection.em.persistAndFlush(createdToDo);

      res.status(201).json(createdToDo);
    } catch (error) {
      console.error('Error creating ToDo:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async updateOne(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { text, done } = req.body;

      const fetchedTodo = await DependencyInjection.todos.findOne(id);

      if (!fetchedTodo) {
        res.status(404).json({ message: 'ToDo not found' });
        return;
      }

      fetchedTodo.text = text ?? fetchedTodo.text;
      fetchedTodo.done = done ?? fetchedTodo.done;

      await DependencyInjection.em.flush();

      if (done) {
        await sendSMS(text);
      }

      res.status(200).json(fetchedTodo);
    } catch (error) {
      console.error('Error updating ToDo:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  async deleteOne(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const fetchedTodo = await DependencyInjection.todos.findOne(id);

      if (!fetchedTodo) {
        res.status(404).json({ message: 'ToDo not found' });
        return;
      }

      await DependencyInjection.em.removeAndFlush(fetchedTodo);

      res.status(204).end();
    } catch (error) {
      console.error('Error deleting ToDo:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

export default ToDoController;
