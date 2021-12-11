import express from 'express';

import authRouter from './routes/authRoutes';
import databaseService from './services/DatabaseService';

async function init() {
  const app = express();
  const port = process.env['APP_PORT'];

  app.use(express.json());

  app.use('/auth', authRouter);

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
