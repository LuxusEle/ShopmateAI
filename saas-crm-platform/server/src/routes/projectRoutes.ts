import { Router } from 'express';

const router = Router();

// GET /api/projects - Get all projects
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Projects retrieved successfully'
  });
});

// POST /api/projects - Create new project
router.post('/', (req, res) => {
  res.status(201).json({
    success: true,
    data: req.body,
    message: 'Project created successfully'
  });
});

// GET /api/projects/:id - Get project by ID
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    data: { id: req.params.id },
    message: 'Project retrieved successfully'
  });
});

// PUT /api/projects/:id - Update project
router.put('/:id', (req, res) => {
  res.json({
    success: true,
    data: { id: req.params.id, ...req.body },
    message: 'Project updated successfully'
  });
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Project deleted successfully'
  });
});

export default router;
