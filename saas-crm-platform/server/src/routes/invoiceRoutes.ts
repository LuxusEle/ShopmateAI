import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, data: [], message: 'Invoices retrieved' });
});

router.post('/', (req: Request, res: Response) => {
  res.status(201).json({ success: true, data: req.body, message: 'Invoice created' });
});

router.get('/:id', (req: Request, res: Response) => {
  res.json({ success: true, data: { id: req.params.id }, message: 'Invoice retrieved' });
});

router.put('/:id', (req: Request, res: Response) => {
  res.json({ success: true, data: { id: req.params.id, ...req.body }, message: 'Invoice updated' });
});

export default router;
