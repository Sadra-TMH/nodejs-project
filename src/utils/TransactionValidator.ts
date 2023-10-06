import { IsEnum, IsInt, IsNotEmpty, IsNumber } from "class-validator";
import { Client } from "../entity/Client";
import { TransactionTypes } from "../entity/Transaction";

export class TransactionValidator {
  @IsNotEmpty({
    message: "type is required.",
  })
  @IsEnum(TransactionTypes, {
    message: "type must be either 'deposit' or 'withdraw'.",
  })
  type: TransactionTypes;

  @IsNotEmpty({
    message: "amount is required.",
  })
  @IsNumber(
    {
      allowNaN: true,
      allowInfinity: false,
    },
    {
      message: "amount must be a number.",
    }
  )
  amount: number;

  @IsNotEmpty({
    message: "client_id is required.",
  })
  @IsInt({
    message: "client_id must be an integer.",
  })
  client_id: number;
}
