import { Request, Response } from 'express';
import { wrap } from '@mikro-orm/mongodb';
import { DependencyInjection } from '..';
import { ToDoEntity } from '../shared/entities';

const ToDoController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const fetchedTodos = await DependencyInjection.todos.findAll();

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

      wrap(fetchedTodo).assign({ text, done });
      await DependencyInjection.em.flush();

      res.status(200).json(fetchedTodo);
    } catch (error) {
      console.error('Error updating ToDo:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

export default ToDoController;
