import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { Permission } from "./entities/permission.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NotFoundError } from "rxjs";

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    return this.permissionRepository.save(createPermissionDto);
  }

  findAll() {
    return this.permissionRepository.find();
  }

  findOne(id: number) {
    return this.permissionRepository.findOne({ where: { id } });
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ["roles"],
    });
    if (!permission) {
      throw new NotFoundException(`This permission ${id} not exist`);
    }
    if (updatePermissionDto.name !== undefined) {
      permission.name = updatePermissionDto.name;
    }
    if (updatePermissionDto.description !== undefined) {
      permission.description = updatePermissionDto.description;
    }
    return await this.permissionRepository.save(permission);
  }

  async remove(id: number) {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException(`This permission ${id} not exist`);
    }
    await this.permissionRepository.remove(permission);
  }
}
