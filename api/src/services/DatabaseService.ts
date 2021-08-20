import Knex from 'knex';
const knexFile = require('../../knexfile.js');
let knexConfig: Knex.ConnectionConfig;

if (process.env['NODE_ENV'] === 'PRODUCTION') {
  knexConfig = knexFile.production;
} else {
  knexConfig = knexFile.development;
}

class DatabaseService {
  private pg: Knex;

  public connect(): Promise<Knex> {
    return new Promise((resolve, reject) => {
      this.pg = Knex(knexConfig);

      this.pg
        .raw('select 1+1;') // check if connection was successful
        .then(() => resolve(this.pg))
        .catch(() => reject('Error connecting to database'));
    });
  }

  public get connection(): Knex {
    if (!this.pg) throw new Error('Database not connected');

    return this.pg;
  }
}

const databaseService = new DatabaseService();

export default databaseService;
