import express from 'express';
import { env } from 'process';

const app = express();
const port = env['APP_PORT'] || 3000;

app.get('/', (_, res) => {
  res.json({ msg: 'Hello world!' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});