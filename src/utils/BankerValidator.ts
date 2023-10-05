import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from "class-validator";

export class BankerValidator {
  @IsNotEmpty()
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
  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(5, {
    message: "Card Number is too short",
  })
  @MaxLength(10, {
    message: "Card Number is too long",
  })
  @IsNotEmpty()
  card_number: string;

  @IsNotEmpty()
  employee_number: string;

  @IsOptional()
  @IsArray()
  clients: [];
}
