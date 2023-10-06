import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Transaction, TransactionTypes } from "../entity/Transaction";
import { Client } from "../entity/Client";
import { TransactionValidator } from "../utils/TransactionValidator";
import { validate } from "class-validator";

class TransactionController {
  private static clientRepository = AppDataSource.getRepository(Client);
  private static transactionRepository =
    AppDataSource.getRepository(Transaction);

  static async create(req: Request, res: Response) {
    const { type, amount, client_id } = req.body;

    const newTransaction = new TransactionValidator();
    newTransaction.amount = amount;
    newTransaction.type = type;
    newTransaction.client_id = client_id;

    const validationErrors = await validate(newTransaction, {
      validationError: { target: false, value: false },
    }).then((errors) => {
      if (errors.length > 0) {
        return errors;
      } else {
        return false;
      }
    });

    if (validationErrors) {
      return res.status(400).json({ status: false, message: validationErrors });
    }

    const foundClient = await TransactionController.clientRepository.findOneBy({
      id: client_id,
    });

    if (!foundClient) {
      return res
        .status(404)
        .json({ status: false, message: "client does not exist." });
    }
    let transaction = { ...newTransaction, client: foundClient };

    try {
      switch (type) {
        case TransactionTypes.DEPOSIT:
          foundClient.balance = Number(foundClient.balance) + Number(amount);
          break;
        case TransactionTypes.WITHDRAW:
          foundClient.balance = Number(foundClient.balance) - Number(amount);
          break;
      }

      await TransactionController.clientRepository.save(foundClient);

      await TransactionController.transactionRepository.save(transaction);

      res
        .status(201)
        .json({ status: true, message: "transaction created successfully." });
    } catch (err) {
      res.sendStatus(500).json({ status: false, message: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    if (!parseInt(id)) {
      return res
        .status(404)
        .json({ status: false, message: "invalid id parameter." });
    }

    let foundTransaction = await TransactionController.transactionRepository
      .createQueryBuilder("transaction")
      .leftJoinAndSelect("transaction.client", "client")
      .where("transaction.id = :id", { id })
      .getOne();

    if (!foundTransaction) {
      return res
        .status(404)
        .json({ status: false, message: "transaction does not exist." });
    }

    try {
      switch (foundTransaction.type) {
        case TransactionTypes.DEPOSIT:
          foundTransaction.client.balance =
            Number(foundTransaction.client.balance) -
            Number(foundTransaction.amount);
          break;
        case TransactionTypes.WITHDRAW:
          foundTransaction.client.balance =
            Number(foundTransaction.client.balance) +
            Number(foundTransaction.amount);
          break;
      }

      await TransactionController.clientRepository.save(
        foundTransaction.client
      );

      await TransactionController.transactionRepository.softDelete({ id });

      res
        .status(201)
        .json({ status: true, message: "transaction deleted successfully." });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  }
}

export default TransactionController;
