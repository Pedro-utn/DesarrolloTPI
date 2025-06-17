import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Nombre del permiso",
  })
  name: string;

  @ApiProperty({
    description: "Descripción del permiso",
  })
  @IsString()
  description: string;
}
