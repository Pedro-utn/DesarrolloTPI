import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { In, Repository } from "typeorm";
import { Permission } from "src/permissions/entities/permission.entity";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const { permissions, ...rest } = createRoleDto;

    const permissionIds = permissions.map((p) => p.id);

    if (permissionIds.length === 0) {
      throw new NotFoundException("Permissions not found");
    }

    const foundPermissions = await this.permissionRepository.findBy({
      id: In(permissionIds),
    });

    if (foundPermissions.length === 0) {
      throw new NotFoundException("No matching permissions found");
    }

    const foundIds = foundPermissions.map((p) => p.id);
    const missingPermissions = permissionIds.filter(
      (id) => !foundIds.includes(id),
    );
    if (missingPermissions.length > 0) {
      throw new NotFoundException(
        `Permissions not found: ${missingPermissions.join(", ")}`,
      );
    }

    const role = this.roleRepository.create({
      ...rest,
      permissions: foundPermissions,
    });

    return this.roleRepository.save(role);
  }
  findAll() {
    return this.roleRepository.find();
  }

  findOne(id: number) {
    return this.roleRepository.findOne({ where: { id } });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const { permissions, ...rest } = updateRoleDto;

    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ["permissions"],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    let foundPermissions = [];

    if (permissions && permissions.length > 0) {
      const permissionIds = permissions.map((p) => p.id);

      foundPermissions = await this.permissionRepository.findBy({
        id: In(permissionIds),
      });

      const foundIds = foundPermissions.map((p) => p.id);
      const missingPermissions = permissionIds.filter(
        (id) => !foundIds.includes(id),
      );
      if (missingPermissions.length > 0) {
        throw new NotFoundException(
          `Permissions not found: ${missingPermissions.join(", ")}`,
        );
      }

      role.permissions = foundPermissions;
    }

    Object.assign(role, rest);

    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException(`This role with this ${id} not found`);
    }
    await this.roleRepository.remove(role);
  }
}
