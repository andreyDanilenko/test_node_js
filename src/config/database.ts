import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/User';

export const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'node_test',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'my_pass',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  dialect: 'postgres',
  models: [User],
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connection successfully.');
    
    if (process.env.NODE_ENV === 'development') {
      // автомиграция
      // true для разработки чтобы делать сброс базы
      await sequelize.sync({ force: true });
      console.log('Database synchronized.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};
