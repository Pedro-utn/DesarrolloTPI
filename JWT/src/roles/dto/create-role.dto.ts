import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsString, ValidateNested } from "class-validator";
import { IdOnlyPermissionDto } from "src/permissions/dto/id-only-dto.dto";

export class CreateRoleDto {
  @IsString()
  @ApiProperty({ description: "El código representativo del rol" })
  code: string;

  @IsString()
  @ApiProperty({ description: "El nombre del rol" })
  name: string;

  @IsString()
  @ApiProperty({ description: "La descripción del rol" })
  description: string;

  @ValidateNested({ each: true })
  @Type(() => IdOnlyPermissionDto)
  @IsArray()
  @ApiProperty({
    description: "Array de nombres de los permisos a asociar al rol",
  })
  permissions: IdOnlyPermissionDto[];
}
