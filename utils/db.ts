import {ConnectionOptions, createConnection} from 'mysql2';
import { get_value_from_env } from './env'; 


const create_connect_config = (): ConnectionOptions => {
  return {
    host: get_value_from_env('DB_HOST'),
    user: get_value_from_env('DB_USER'),
    password: get_value_from_env('DB_PASSWORD'),
    database: get_value_from_env('DB_NAME'),
    port: parseInt(get_value_from_env('DB_PORT')),
  }
}
export const connection = createConnection(create_connect_config());
console.log('Connected to database', create_connect_config());