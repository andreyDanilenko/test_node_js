import { CreationAttributes, Model } from "sequelize";

export interface IUser extends Model {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserCreate extends CreationAttributes<IUser> {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface IUserSanitized {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface IAuthResult {
  user: IUserSanitized;
  token: string;
}
