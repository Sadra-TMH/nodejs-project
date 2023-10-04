import { IsArray, IsDefined, IsEmail, IsOptional, MaxLength, MinLength } from "class-validator";

export class BankerValidator {
  @IsDefined()
  @MinLength(3, {
    message: "First Name is too short",
  })
  @MaxLength(20, {
    message: "First Name is too long",
  })
  first_name: string;

  @MinLength(3, {
    message: "Last Name is too short",
  })
  @MaxLength(20, {
    message: "Last Name is too long",
  })
  @IsDefined()
  last_name: string;

  @IsEmail()
  @IsDefined()
  email: string;

  @MinLength(5, {
    message: "Card Number is too short",
  })
  @MaxLength(10, {
    message: "Card Number is too long",
  })
  @IsDefined()
  card_number: string;

  @IsDefined()
  employee_number: string;

  @IsOptional()
  @IsArray()
  clients: [];
}
