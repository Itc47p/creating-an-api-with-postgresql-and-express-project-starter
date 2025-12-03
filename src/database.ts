import dotennv from 'dotenv';
import {  Pool } from 'pg';

dotennv.config();

const { POSTGRES_DB, POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, DATABASE_NAME } = process.env;

const Client = new Pool({
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
});

export default Client;
