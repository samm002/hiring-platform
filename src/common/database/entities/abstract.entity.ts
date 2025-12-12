import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Base abstract class for all entities
export abstract class AbstractEntity {
  // Default id as UUID v4
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Automatic filled "createdAt" column upon "first creation"
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  // Automatic filled "updatedAt" column upon "every update" action
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // Automatic filled "deletedAt" column upon "soft delete" action
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
