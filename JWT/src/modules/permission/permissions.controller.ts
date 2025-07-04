import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from "@nestjs/common";
import { PermissionsService } from "./permissions.service";
import { CreatePermissionDto, UpdatePermissionDto } from "./permissions.service";
import { AuthGuard } from "../../auth/middlewares/auth.middleware";
import { Permissions } from "../../auth/middlewares/decorators/permissions.decorator";

@Controller("permissions")
@UseGuards(AuthGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Permissions(["createPermission"])
  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Permissions(["getPermission"])
  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @Permissions(["getPermission"])
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.permissionsService.findOne(+id);
  }

  @Permissions(["updatePermission"])
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @Permissions(["deletePermission"])
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.permissionsService.remove(+id);
  }
}
