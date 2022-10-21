import {ConnectionOptions, createConnection} from 'mysql2';


const get_value_from_env = (name: string): string => {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
}

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