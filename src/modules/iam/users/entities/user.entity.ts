import { AbstractEntity } from '@common/database/entities';
import { UserType } from '@common/enums';
import { RoleEntity } from '@modules/iam/roles/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ schema: 'auth', name: 'users' })
export class UserEntity extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserType,
  })
  userType: UserType;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ default: false, name: 'is_verified' })
  isVerified: boolean;

  // 1 User only can have 1 Role
  @ManyToOne(() => RoleEntity, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
}
