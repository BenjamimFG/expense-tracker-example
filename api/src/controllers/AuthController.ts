import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import databaseService from '../services/DatabaseService';
import EmailService from '../services/EmailService';
import PhoneService from '../services/PhoneService';
import User from '../models/User';

class AuthController {
  public static async register(req: Request<any, any, User>, res: Response) {
    const user = req.body;

    if (user.phone) {
      if (!(await PhoneService.isValid(user.phone))) {
        return res.status(400).json({ error: { type: 'INVALID_PHONE', path: 'phone' } });
      }
    }

    try {
      const rows = await databaseService.connection('app_user').where({ email: user.email });

      if (rows.length > 0)
        return res.status(409).json({ error: { type: 'DUPLICATE', path: 'email' } });

      const hashedPassword = await bcrypt.hash(user.password, 10);

      await databaseService.connection('app_user').insert({
        display_name: user.displayName,
        email: user.email,
        phone: user.phone,
        password_hash: hashedPassword,
        default_currency_code: user.totalFundsCurrencyCode
      });

      EmailService.sendConfirmationEmail(user.email);

      return res.status(201).json({ email: user.email });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: { type: 'INTERNAL_SERVER_ERROR' } });
    }
  }

  public static login(_: Request, res: Response) {
    res.send('login');
  }

  public static async resendConfirmationEmail(req: Request, res: Response) {
    const userEmail = req.body.userEmail;

    if (userEmail) {
      const rows = await databaseService.connection('app_user').where({ email: userEmail });

      if (rows.length > 0) {
        EmailService.sendConfirmationEmail(userEmail);

        return res.status(200).json({ email: userEmail });
      }
    }

    return res.status(400).json({ error: { type: 'INVALID_EMAIL', path: 'userEmail' } });
  }

  public static async confirmEmail(req: Request, res: Response) {
    try {
      const { userEmail }: any = jwt.verify(req.params.jwt, process.env.EMAIL_JWT_SECRET!);
      await databaseService.connection
        .table('app_user')
        .where({ email: userEmail })
        .update({ email_confirmed: true });

      return res.status(200).json({ redirectUrl: '' });
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  }
}

export default AuthController;
