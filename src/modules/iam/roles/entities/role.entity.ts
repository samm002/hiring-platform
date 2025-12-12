import { AbstractEntity } from '@common/database/entities';
import { PermissionEntity } from '@modules/iam/permissions/entities/permission.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity({ schema: 'auth', name: 'roles' })
export class RoleEntity extends AbstractEntity {
  @Column({ unique: true })
  name: string; // Example: 'Recruiter Manager', 'Super Admin'

  @Column({ nullable: true })
  description: string;

  // 1 Role could have many Permissions
  @ManyToMany(() => PermissionEntity, {
    eager: true, // AUTO LOAD: load permission together upon loading Role (Auth purpose)
    cascade: true,
  })
  @JoinTable({
    name: 'roles_permissions', // Pivot table
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: PermissionEntity[];
}
