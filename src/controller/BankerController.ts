import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Banker } from "../entity/Banker";

class BankerController {
  static async create(req: Request, res: Response) {
    const { first_name, last_name, email, card_number, employee_number } =
      req.body;

    const bankerRepo = AppDataSource.getRepository(Banker);

    try {
      const newBanker = new Banker();
      newBanker.first_name = first_name;
      newBanker.last_name = last_name;
      newBanker.email = email;
      newBanker.card_number = card_number;
      newBanker.employee_number = employee_number;

      await bankerRepo.save(newBanker);

      res
        .status(201)
        .json({ status: true, message: "banker created successfully." });
    } catch (err) {
      res.sendStatus(500).json({ status: false, message: err.message });
    }
  }
}

export default BankerController;
