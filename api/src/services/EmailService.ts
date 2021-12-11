import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

class EmailService {
  public static sendConfirmationEmail(userEmail: string) {
    if (!process.env.EMAIL_JWT_SECRET) {
      throw new Error('EMAIL_JWT_SECRET environment variable not set');
    }

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
  }
}

export default EmailService;
