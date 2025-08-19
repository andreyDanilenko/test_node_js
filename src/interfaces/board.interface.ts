import { CreationAttributes, Model } from "sequelize";

export interface IBoard extends Model {
  id: number;
  title: string;
  description?: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBoardCreate extends CreationAttributes<IBoard>  {
  title: string;
  description?: string;
  userId: number;
}

export interface IBoardSanitized {
  id: number;
  title: string;
  description?: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
