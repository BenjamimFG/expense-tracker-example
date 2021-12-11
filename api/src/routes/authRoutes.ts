import { Router } from 'express';

import AuthController from '../controllers/AuthController';
import userValidator from '../validators/userValidator';
import validateReq from '../middlewares/validateReq';

const authRouter = Router();

authRouter.post('/register', validateReq(userValidator, 'body'), AuthController.register);
authRouter.post('/login', AuthController.login);
authRouter.get('/email-confirmation/:jwt', AuthController.confirmEmail);
authRouter.post('/resend-confirmation-email', AuthController.resendConfirmationEmail);

export default authRouter;
