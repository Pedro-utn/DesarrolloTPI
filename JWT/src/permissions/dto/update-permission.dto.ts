import { IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { IdOnlyRolDto } from "src/roles/dto/id-only-dto.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: "Nombre del permiso" })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: "Descripción del permiso" })
  description: string;

  @IsOptional()
  @ValidateNested()
  @ApiProperty({ description: "Array de roles a asociar este permiso" })
  @Type(() => IdOnlyRolDto)
  id_rol: IdOnlyRolDto[];
}
