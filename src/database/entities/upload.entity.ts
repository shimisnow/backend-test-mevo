import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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
  from: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: UploadStatusEnum,
    enumName: 'uploads_status_enum',
    default: UploadStatusEnum.PENDING,
    nullable: false,
  })
  status: UploadStatusEnum;
}
