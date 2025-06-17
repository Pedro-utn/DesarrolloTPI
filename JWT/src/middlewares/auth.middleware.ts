import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "./auth.services";
import { Permissions } from "./decorators/permissions.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace("Bearer ", "");
    const permissions = this.reflector.get(Permissions, context.getHandler());

    const user = await this.authService.validateTokenAndPermissions(
      token,
      permissions,
    );
    request.user = user;
    return true;
  }
}
