import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, data: [], message: 'Vendors retrieved' });
});

router.post('/', (req: Request, res: Response) => {
  res.status(201).json({ success: true, data: req.body, message: 'Vendor created' });
});

router.get('/:id', (req: Request, res: Response) => {
  res.json({ success: true, data: { id: req.params.id }, message: 'Vendor retrieved' });
});

router.put('/:id', (req: Request, res: Response) => {
  res.json({ success: true, data: { id: req.params.id, ...req.body }, message: 'Vendor updated' });
});

export default router;
