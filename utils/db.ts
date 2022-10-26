import {ConnectionOptions, createConnection} from 'mysql2';
import { getValueFromEnv } from './env'; 


const createConnectConfig = (): ConnectionOptions => {
  return {
    host: getValueFromEnv('DB_HOST'),
    user: getValueFromEnv('DB_USER'),
    password: getValueFromEnv('DB_PASSWORD'),
    database: getValueFromEnv('DB_NAME'),
    port: parseInt(getValueFromEnv('DB_PORT')),
  }
}
export const connection = createConnection(createConnectConfig());
