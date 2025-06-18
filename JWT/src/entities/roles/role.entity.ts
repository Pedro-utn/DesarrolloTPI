import { Permission } from "src/entities/permissions/permission.entity";
import { UserEntity } from "../users/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity("rol")
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'rol_permissions_permission',
    joinColumns: [{name:'rolId'}],
    inverseJoinColumns: [{name: 'permissionId'}],
  })
  permissions: Permission[];

  @OneToMany(() => UserEntity, (user) => user.rol)
  users: UserEntity[];
}
