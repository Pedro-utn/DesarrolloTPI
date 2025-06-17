import { UsersService } from './users.service';
import { LoginDTO } from '../interfaces/login.dto';
import { RegisterDTO } from '../interfaces/register.dto';
import { Request } from 'express';
import { RequestWithUser } from 'src/interfaces/request-user';
export declare class UsersController {
    private service;
    constructor(service: UsersService);
    me(req: RequestWithUser): {
        email: string;
    };
    login(body: LoginDTO): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    register(body: RegisterDTO): Promise<{
        status: string;
    }>;
    canDo(request: RequestWithUser, permission: string): boolean;
    refreshToken(request: Request): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
