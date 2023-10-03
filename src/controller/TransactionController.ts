import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Transaction, TransactionTypes } from "../entity/Transaction";
import { Client } from "../entity/Client";

class TransactionController {
  static async create(req: Request, res: Response) {
    const { type, amount, client_id } = req.body;

    const transactionRepo = AppDataSource.getRepository(Transaction);
    const clientRepo = AppDataSource.getRepository(Client);

    try {
      let client = await clientRepo.findOneBy({ id: client_id });
      if (!client) {
        return res
          .status(404)
          .json({ status: false, message: "client not found" });
      }

      const newTransaction = new Transaction();
      newTransaction.type = type;
      newTransaction.amount = amount;
      newTransaction.client = client;

      await transactionRepo.save(newTransaction);

      switch (type) {
        case TransactionTypes.DEPOSIT:
          client.balance = Number(client.balance) + Number(amount);
          break;
        case TransactionTypes.WITHDRAW:
          client.balance = Number(client.balance) - Number(amount);
          break;
      }
      await clientRepo.save(client);

      res
        .status(201)
        .json({ status: true, message: "transaction created successfully." });
    } catch (err) {
      res.sendStatus(500).json({ status: false, message: err.message });
    }
  }
}

export default TransactionController;
