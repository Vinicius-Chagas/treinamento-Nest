/* eslint-disable prettier/prettier */
/* eslint-disable n/no-path-concat */
import * as path from 'path'
import { DataSource, DataSourceOptions } from 'typeorm'
import * as dotenv from 'dotenv';
import { ConfigService, registerAs } from '@nestjs/config';

dotenv.config();

const configService = new ConfigService();

const config = {
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: parseInt(configService.get('DB_PORT') || '', 10) || 3306,
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    synchronize: false,
    migrationsRun: true,
    entities: [path.join(__dirname, '..','..', '/**/*.entity{.ts,.js}')],
    migrations: [
      path.join(__dirname, '..','..', '/database/migrations/**/*{.ts,.js}'),
    ],
    logging: Boolean(configService.get('DB_LOGGING')),
    ssl:
    configService.get('NODE_ENV') !== 'production'
        ? false
        : {
            rejectUnauthorized: false,
          },
    extra: {
      connectionLimit: 20,
    }
  }

  export default registerAs('typeorm', () => config)
  export const connectionSource = new DataSource(config as DataSourceOptions)

