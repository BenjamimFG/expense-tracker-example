import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import databaseService from '../services/DatabaseService';
import JsonResponse from '../models/JsonResponse';

class AuthController {
  public static async register(req: Request<any, any, User>, res: Response<JsonResponse>) {
    const user = req.body;

    try {
      const rows = await databaseService.connection('app_user').where({ email: user.email });

      if (rows.length > 0)
        return res.status(409).json({ success: false, error: 'EMAIL_ALREADY_REGISTERED' });

      const hashedPassword = await bcrypt.hash(user.password, 10);

      await databaseService.connection('app_user').insert({
        display_name: user.displayName,
        email: user.email,
        phone: user.phone,
        password_hash: hashedPassword
      });

      return res.status(201).json({ success: true, data: { email: user.email } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'INTERNAL_SERVER_ERROR' });
    }
  }

  public static login(_: Request, res: Response) {
    res.send('login');
  }
}

export default AuthController;
