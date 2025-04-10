import { DataSource } from 'typeorm';
import 'dotenv/config';
// import các entity khác nếu có

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'blog_db',
  entities: [__dirname + '/../**/*.entity.{js,ts}'], // <-- thêm các entity của bạn vào đây
  migrations: ['dist/migrations/*.js'],
  synchronize: false, // ⚠️ KHÔNG nên true trong production
  logging: true,
});
