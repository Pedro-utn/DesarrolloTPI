import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto, UpdateRoleDto } from "../roles/roles.service";
import { AuthGuard } from "../../auth/middlewares/auth.middleware";
import { Permissions } from "../../auth/middlewares/decorators/permissions.decorator";

@UseGuards(AuthGuard)
@Controller("roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Permissions(["createRole"])
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Permissions(["getRole"])
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Permissions(["getRole"])
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.rolesService.findOne(+id);
  }

  @Permissions(["updateRole"])
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Permissions(["deleteRole"])
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.rolesService.remove(+id);
  }
}
