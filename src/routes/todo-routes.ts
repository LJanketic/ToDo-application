import express from 'express';
import ToDoController from '../controllers/todo-controller';

const router = express.Router();

router.get('/todos', ToDoController);
router.get('/todos/:id', ToDoController);
router.post('/todos', ToDoController);
router.patch('/todos/:id', ToDoController);

export default router;
