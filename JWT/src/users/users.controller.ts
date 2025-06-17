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
import { LoginDTO } from "../interfaces/login.dto";
import { RegisterDTO } from "../interfaces/register.dto";
import { Request } from "express";
import { AuthGuard } from "../middlewares/auth.middleware";
import { RequestWithUser } from "src/interfaces/request-user";
import { UpdateUserRole } from "./dto/update-user-role.dto";
import { Permissions } from "src/middlewares/decorators/permissions.decorator";
import { AuthService } from "src/middlewares/auth.services";

@Controller("")
export class UsersController {
  constructor(
    private service: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Permissions(["test"])
  @Get("me")
  me(@Req() req: RequestWithUser) {
    return {
      email: req.user.email,
    };
  }

  @UseGuards(AuthGuard)
  @Permissions(["test"])
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

  // @UseGuards(AuthGuard)
  // @Permissions(["admin"])
  // @Get("can-do/:permission")
  // canDo(
  //   @Req() request: RequestWithUser,
  //   @Param("permission") permission: string,
  // ) {
  //   return this.service.canDo(request.user, permission);
  // }

  @Get("refresh-token")
  refreshToken(@Req() request: Request) {
    return this.service.refreshToken(
      request.headers["refresh-token"] as string,
    );
  }

  @Post("auth/validate-permissions")
  validatePermission(
    @Headers("authorization") authorization: string,
    @Body("requiredPermissions") requiredPermissions: string[],
  ) {
    return this.authService.validateTokenAndPermissions(
      authorization,
      requiredPermissions,
    );
  }
}
