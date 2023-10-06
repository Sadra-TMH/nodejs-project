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

  private static applyBalanceChange(
    transaction: any,
    client: Client,
    type: string = "do"
  ): void {
    switch (transaction.type) {
      case TransactionTypes.DEPOSIT:
        type === "do"
          ? (client.balance =
              Number(client.balance) + Number(transaction.amount))
          : (client.balance =
              Number(client.balance) - Number(transaction.amount));
        break;
      case TransactionTypes.WITHDRAW:
        type === "do"
          ? (client.balance =
              Number(client.balance) - Number(transaction.amount))
          : (client.balance =
              Number(client.balance) + Number(transaction.amount));
        break;
    }
  }

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

    TransactionController.applyBalanceChange(transaction, foundClient);
    try {
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
      TransactionController.applyBalanceChange(
        foundTransaction,
        foundTransaction.client,
        "undo"
      );

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

  static async update(req: Request, res: Response) {
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

    const { type, amount, client_id } = req.body;

    const newTransaction = new TransactionValidator();
    newTransaction.amount = amount;
    newTransaction.type = type;
    newTransaction.client_id = client_id;

    const validationErrors = await validate(newTransaction, {
      validationError: { target: false, value: false },
      skipMissingProperties: true,
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

    let transaction = newTransaction;

    TransactionController.applyBalanceChange(
      foundTransaction,
      foundTransaction.client,
      "undo"
    );
    await TransactionController.clientRepository.save(foundTransaction.client);

    if (
      newTransaction.client_id &&
      !(foundTransaction.client.id === newTransaction.client_id)
    ) {
      // get clients list
      const client = await TransactionController.clientRepository
        .createQueryBuilder("client")
        .where("client.id = :id", { id: newTransaction.client_id })
        .getOne();
      let transaction = { ...newTransaction, client };
      foundTransaction.client = client;
    }

    Object.keys(transaction).forEach((key) =>
      transaction[key] === undefined
        ? delete transaction[key]
        : (foundTransaction[key] = transaction[key])
    );
    TransactionController.applyBalanceChange(
      foundTransaction,
      foundTransaction.client
    );

    try {
      await TransactionController.clientRepository.save(
        foundTransaction.client
      );
      await TransactionController.transactionRepository.save(foundTransaction);

      res
        .status(201)
        .json({ status: true, message: "transaction updated successfully." });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  }

  static async getOne(req: Request, res: Response) {
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
    } else {
      res.status(200).json(foundTransaction);
    }
  }

  static async getAll(req: Request, res: Response) {
    let transactions = await TransactionController.transactionRepository
      .createQueryBuilder("transaction")
      .leftJoinAndSelect("transaction.client", "client")
      .getMany();
    return res.json(transactions);
  }
}

export default TransactionController;
