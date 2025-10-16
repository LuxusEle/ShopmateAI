import { Router, Request, Response } from 'express';

const router = Router();

router.get('/config', (req: Request, res: Response) => {
  res.json({ success: true, data: {}, message: 'Automation config retrieved' });
});

router.post('/config', (req: Request, res: Response) => {
  res.status(201).json({ success: true, data: req.body, message: 'Automation config created' });
});

router.post('/trigger', (req: Request, res: Response) => {
  res.json({ success: true, data: {}, message: 'Automation triggered' });
});

export default router;
