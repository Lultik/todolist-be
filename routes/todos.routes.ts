import { Request, Response, Router } from "express";
import { Types } from "mongoose";
const JSONStream = require('JSONStream')

const Todo = require('./../models/Todo')

const router = Router();

const paginatedResults = async (req: Request, res: Response) => {
  let page: number = 1;
  let limit: number = 100000;

  if (req.query.page) {
    page = parseInt(String(req.query.page));
  }
  if (req.query.limit) {
    limit = parseInt(String(req.query.limit));
  }

  const skipIndex = (page - 1) * limit;
  try {
    res.locals.result = await Todo.find({isDeleted: false})
      .limit(limit)
      .skip(skipIndex)
      .cursor()
      .pipe(JSONStream.stringify())
      .pipe(res);
  } catch (e) {
    res.status(500).json({message: "Error Occurred"});
  }
};

router.get('/', paginatedResults, async (req: Request, res: Response) => {
  try {
    const todos = res.locals.result;
    if ([...todos].length === 0) {
      return res.status(404).json({message: 'Todos were not found'})
    }
    res.status(200).json(todos);
  } catch (e) {
    res.status(500).json({message: e.message});
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = new Types.ObjectId(req.params.id);
    const todo = Todo.find({isDeleted: false, _id: id});

    if ([...todo].length === 0) {
      return res.status(404).json({message: 'Requested todo was not found'})
    }

    res.status(200).json(todo);
  } catch (e) {
    res.status(500).json({message: e.message});
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {

    if (req.body.todo === null) {
      return res.status(400).json({message: 'Todo text required'})
    }

    const todo = new Todo({
      todo: req.body.todo,
      isDeleted: false,
      DeletingDate: null,
    });
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (e) {
    res.status(400).json({message: e.message})
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true
      })
    res.json(updatedTodo);
  } catch (e) {

  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true,
        DeletingDate: new Date(),
      },
      {
        new: true
      });
    res.status(200).json(todo);
  } catch (e) {
    res.status(500).json({message: e.message});
  }
})

export { router };
