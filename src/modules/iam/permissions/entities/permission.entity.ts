import { AbstractEntity } from '@common/database/entities';
import { Column, Entity } from 'typeorm';

@Entity({ schema: 'auth', name: 'permissions' })
export class PermissionEntity extends AbstractEntity {
  @Column({ unique: true })
  slug: string; // Example: 'jobs.create', 'users.view' (system purpose)

  @Column({ unique: true })
  name: string; // Example: 'Post New Job' (label for clarity purpose)

  @Column({ nullable: true })
  description: string; // Example: 'Allows user to post new jobs'
}
