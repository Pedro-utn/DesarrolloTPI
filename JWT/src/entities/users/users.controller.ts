import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  Headers,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { LoginDTO } from "../../interfaces/login.dto";
import { RegisterDTO } from "../../interfaces/register.dto";
import { Request } from "express";
import { AuthGuard } from "../../middlewares/auth.middleware";
import { RequestWithUser } from "src/interfaces/request-user";
import { UpdateUserRole } from "../users/users.service";
import { Permissions } from "src/middlewares/decorators/permissions.decorator";
import { AuthService } from "src/middlewares/auth.services";

@Controller("")
export class UsersController {
  constructor(
    private service: UsersService,
    private authService: AuthService,
  ) {}

  @Get("me")
  @UseGuards(AuthGuard)
  me(@Req() req: RequestWithUser) {
    return {
      email: req.user.email,
      id: req.user.id,
    };
  }

  @UseGuards(AuthGuard)
  @Permissions(["admin"])
  @Post(":id/assignRoles")
  @Permissions(["assignRoles"])
  updateRol(@Param("id") id: string, @Body() updateUserRol: UpdateUserRole) {
    return this.service.updateRol(Number(id), updateUserRol);
  }

  @Post("login")
  login(@Body() body: LoginDTO) {
    return this.service.login(body);
  }

  @Post("register")
  register(@Body() body: RegisterDTO) {
    return this.service.register(body);
  }

  @Get("refresh-token")
  refreshToken(@Req() request: Request) {
    return this.service.refreshToken(
      request.headers["refresh-token"] as string,
    );
  }

  @Post("auth/validate-permissions")
  async validatePermission(
    @Headers("authorization") authorization: string,
    @Body("requiredPermissions") requiredPermissions: string[],
    @Body("mode") mode: 'any' | 'all' = 'all',
  ) {
    const user = await this.authService.validateTokenAndPermissions(
      authorization,
      requiredPermissions,
      mode,
    );

    // Solo devolvés id y email, sin exponer password, rol, etc.
    return {
      id: user.id,
      email: user.email,
      permissions: user.getPermissions(),
    };
  }

}
