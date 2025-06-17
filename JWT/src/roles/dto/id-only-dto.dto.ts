import { IsString } from "class-validator";

export class IdOnlyRolDto {
  @IsString()
  code: string;
}
