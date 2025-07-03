import { UserI } from "src/modules/interfaces/user.interface";
import { Role } from "../../roles/entities/role.entity";
import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity("users")
export class UserEntity extends BaseEntity implements UserI {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (rol) => rol.users)
  rol: Role;

  getPermissions(): string[] {
  if (!this.rol || !this.rol.permissions) return [];
  return this.rol.permissions.map(p => p.name);
  }
}
