import express from 'express';
import ToDoController from '../controllers/todo-controller';

const router = express.Router();

router.get('/todos', ToDoController.getAll);
router.get('/todos/:id', ToDoController.getOneById);
router.post('/todos', ToDoController.createOne);
router.patch('/todos/:id', ToDoController.updateOne);
router.delete('/todos/:id', ToDoController.deleteOne);

export default router;
