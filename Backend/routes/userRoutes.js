import express from 'express';
import {
  getUserInfo,
  getUserPosts,
  getUserComments,
  getUserLikedPosts,
  updateUser,
} from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/info/:username', getUserInfo);
router.get('/posts/:username', getUserPosts);
router.get('/comments/:username', getUserComments);
router.get('/likes/:username', getUserLikedPosts);
router.put('/update', authenticateToken, updateUser);

export default router;
