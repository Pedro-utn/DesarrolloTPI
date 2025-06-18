import { Request } from "express";
import { UserEntity } from "../entities/users/user.entity";

export interface RequestWithUser extends Request {
  user?: UserEntity;
}
