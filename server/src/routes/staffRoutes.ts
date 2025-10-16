import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, data: [], message: 'Staff retrieved' });
});

router.post('/', (req: Request, res: Response) => {
  res.status(201).json({ success: true, data: req.body, message: 'Staff member created' });
});

router.get('/:id', (req: Request, res: Response) => {
  res.json({ success: true, data: { id: req.params.id }, message: 'Staff retrieved' });
});

router.put('/:id', (req: Request, res: Response) => {
  res.json({ success: true, data: { id: req.params.id, ...req.body }, message: 'Staff updated' });
});

export default router;
