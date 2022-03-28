import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'postgres',
  url: 'postgres://zambbwdj:sCC5S6LlevB4nqu1tE5ThOHQ_w2DCACS@raja.db.elephantsql.com/zambbwdj',
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
  migrations: ['dist/migrations/**/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default config;
