import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import databaseService from '../services/DatabaseService';
import JsonResponse from '../models/JsonResponse';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

class AuthController {
  public static async register(req: Request<any, any, User>, res: Response<JsonResponse>) {
    const user = req.body;

    if (user.phone) {
      try {
        await twilioClient.lookups.v1.phoneNumbers(user.phone).fetch();
      } catch (e) {
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

      AuthController.sendConfirmationEmail(user.email);

      return res.status(201).json({ data: { email: user.email } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: { type: 'INTERNAL_SERVER_ERROR' } });
    }
  }

  public static login(_: Request, res: Response) {
    res.send('login');
  }

  public static async resendConfirmationEmail(req: Request, res: Response<JsonResponse>) {
    const userEmail = req.body.userEmail;

    if (userEmail) {
      const rows = await databaseService.connection('app_user').where({ email: userEmail });

      if (rows.length > 0) {
        AuthController.sendConfirmationEmail(userEmail);

        return res.status(200).json({ data: { email: userEmail } });
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

      return res.status(200).json({ success: true, data: { redirectUrl: '' } });
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  }

  private static sendConfirmationEmail(userEmail: string) {
    if (process.env.EMAIL_JWT_SECRET) {
      jwt.sign(
        { userEmail },
        process.env.EMAIL_JWT_SECRET,
        { expiresIn: '1d' },
        (err, emailToken) => {
          if (!err) {
            const url = `${process.env.APP_URL}/auth/email-confirmation/${emailToken}`;

            transporter
              .sendMail({
                to: userEmail,
                subject: 'Confirm email Expense Tracker',
                html: `
                <h2>Expense Tracker</h2>
                <h3>Confirm your email</h3>
                <div>Please click on the link below to confirm your email<div>
                <a href="${url}">${url}</a>
                `
              })
              .catch((err) => console.error(err));
          }
        }
      );
    } else {
      throw new Error('EMAIL_JWT_SECRET environment variable not set');
    }
  }
}

export default AuthController;
