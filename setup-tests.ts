import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

jest.mock('./src/database/connection.ts');