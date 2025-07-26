// routes/auth.routes.js
import express from 'express';
import {
    loginUser,
    signUpUser,
    getUserData,
    clearCookies,
    cardToCard,
    logData
} from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

/* ─── Auth ─── */
router.post('/login', loginUser);
router.post('/signup', signUpUser);
router.post('/clear-cookies', clearCookies);
router.get('/users', authenticateToken, getUserData);

/* ─── Payments & QR ─── */
router.post('/cardtocard', cardToCard);
router.get('/log-data', logData);

export default router;