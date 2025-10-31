import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const isSSL = process.env.DB_SSL === 'true' || process.env.DB_SSL === '1';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: isSSL ? { rejectUnauthorized: false } : false,
  entities: ['src/**/*.entity.{ts,js}'],
  // Point to seed migrations directory
  migrations: ['src/seeds/*.{ts,js}'],
  synchronize: false,
  logging: false,
});

export default dataSource;
