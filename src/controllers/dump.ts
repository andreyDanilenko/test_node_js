import { Request, Response } from 'express';
import { sequelize } from '../config/database';

export const getAllModelsData = async (req: Request, res: Response): Promise<void> => {
  try {
    // Получаем все модели из экземпляра Sequelize
    const models = sequelize.models;

    const results: Record<string, any[]> = {};
    
    // Для каждой модели получаем все записи
    for (const [modelName, model] of Object.entries(models)) {
      try {
        const data = await model.findAll();
        results[modelName] = data;
      } catch (error) {
        console.error(`Error fetching data for model ${modelName}:`, error);
        results[modelName] = [{ error: `Failed to fetch data: ${error}` }];
      }
    }
    
    res.status(200).json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in getAllModelsData:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
