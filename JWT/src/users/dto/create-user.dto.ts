import { IsString, ValidateNested } from "class-validator";

export class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
