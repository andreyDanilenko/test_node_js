import { CreationAttributes, Model } from "sequelize";

export interface IStickyNote extends Model  {
  id: number;
  title: string;
  content?: string;
  color?: string;
  positionX: number;
  positionY: number;
  boardId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStickyNoteCreate extends CreationAttributes<IStickyNote>  {
  title: string;
  content?: string;
  color?: string;
  positionX?: number;
  positionY?: number;
  boardId: number;
}

export interface IStickyNoteUpdate {
  title?: string;
  content?: string;
  color?: string;
  positionX?: number;
  positionY?: number;
}

export interface IStickyNoteSanitized {
  id: number;
  title: string;
  content?: string;
  color?: string;
  positionX: number;
  positionY: number;
  boardId: number;
  createdAt: Date;
  updatedAt: Date;
}
