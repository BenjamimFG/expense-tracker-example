import express from 'express';
import authRouter from './src/routes/authRoutes';
import databaseService from './src/services/DatabaseService';

async function init() {
  const app = express();
  const port = process.env['APP_PORT'];

  app.use(express.json());

  app.use(authRouter);

  try {
    await databaseService.connect();

    console.log('Successfully connected to database.');

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

init();
