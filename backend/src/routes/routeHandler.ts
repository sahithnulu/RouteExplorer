import { Router } from 'express';
import authRouter from './auth';
import ridesRouter from './rides';
import coverageRouter from './coverage';

const router = Router();

router.use('/auth', authRouter);
router.use('/rides', ridesRouter);
router.use('/coverage', coverageRouter);

export default router;