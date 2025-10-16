import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, data: [], message: 'Tasks retrieved' });
});

router.post('/', (req: Request, res: Response) => {
  res.status(201).json({ success: true, data: req.body, message: 'Task created' });
});

router.get('/:id', (req: Request, res: Response) => {
  res.json({ success: true, data: { id: req.params.id }, message: 'Task retrieved' });
});

router.put('/:id', (req: Request, res: Response) => {
  res.json({ success: true, data: { id: req.params.id, ...req.body }, message: 'Task updated' });
});

export default router;
