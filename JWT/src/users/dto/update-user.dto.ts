import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { IdOnlyRolDto } from "src/roles/dto/id-only-dto.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  password?: string;

  @ValidateNested()
  @Type(() => IdOnlyRolDto)
  id_rol: IdOnlyRolDto;
}
