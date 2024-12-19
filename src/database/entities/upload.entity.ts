import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UploadStatusEnum } from '../enums/upload-status.enum';

@Entity({
  name: 'uploads',
})
export class UploadEntity {
  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: 'pk_uploads',
  })
  id: number;

  @Column({
    name: 'path',
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  path: string;

  @Column({
    name: 'filename',
    type: 'varchar',
    length: 40,
    nullable: false,
  })
  filename: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: UploadStatusEnum,
    enumName: 'uploads_status_enum',
    default: UploadStatusEnum.PENDING,
    nullable: false,
  })
  status: UploadStatusEnum;

  @CreateDateColumn({
    name: 'create_at',
    type: 'timestamp',
    nullable: true,
  })
  createAt?: Date;

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamp',
    nullable: true,
  })
  updateAt?: Date;
}
