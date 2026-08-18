import express from 'express';
import {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  bulkSaveTeam,
  deleteTeamMember,
} from '../controllers/team.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getTeamMembers);

// Admin bulk save route
router.put('/bulk', protect, bulkSaveTeam);

// Single item routes
router.get('/:id', getTeamMemberById);
router.post('/', protect, createTeamMember);
router.put('/:id', protect, updateTeamMember);
router.delete('/:id', protect, deleteTeamMember);

export default router;
