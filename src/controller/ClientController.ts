import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Client } from "../entity/Client";

class ClientController {
  static async create(req: Request, res: Response) {
    const { first_name, last_name, email, card_number, balance } = req.body;

    const clientRepo = AppDataSource.getRepository(Client);

    try {
      const newClient = new Client();
      newClient.first_name = first_name;
      newClient.last_name = last_name;
      newClient.email = email;
      newClient.card_number = card_number;
      newClient.balance = balance;

      await clientRepo.save(newClient);

      res
        .status(201)
        .json({ status: true, message: "client created successfully." });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  }
  static async delete(req: Request, res: Response) {
    const { clientId } = req.params;

    const clientRepo = AppDataSource.getRepository(Client);

    try {
      let client = await clientRepo.findOneBy({ id: parseInt(clientId) });

      await clientRepo.delete(client.id);

      res
        .status(201)
        .json({ status: true, message: "client deleted successfully." });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  }
}

export default ClientController;
