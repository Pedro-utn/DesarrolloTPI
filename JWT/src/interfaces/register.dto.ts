import { IsEmail, IsString } from "class-validator";

export class RegisterDTO {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
