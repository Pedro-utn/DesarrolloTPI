import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { IdOnlyRolDto } from "src/roles/dto/id-only-dto.dto";

export class UpdateUserRole {
  @ValidateNested()
  @Type(() => IdOnlyRolDto)
  rol: IdOnlyRolDto;
}
