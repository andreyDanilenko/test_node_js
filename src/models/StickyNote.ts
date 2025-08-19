import { Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { Board } from './Board';

@Table({ tableName: 'sticky_notes' })
export class StickyNote extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  content!: string;

  @Column({
    type: DataType.STRING(7),
    allowNull: false,
    defaultValue: '#FFEB3B',
  })
  color!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  positionX!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  positionY!: number;

  @ForeignKey(() => Board)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  boardId!: number;

  @BelongsTo(() => Board)
  board!: Board;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
