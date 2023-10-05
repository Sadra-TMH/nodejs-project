import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Banker } from "../entity/Banker";
import { Client } from "../entity/Client";
import { BankerValidator } from "../utils/BankerValidator";
import { validate } from "class-validator";

class BankerController {
  private static bankerRepository = AppDataSource.getRepository(Banker);
  private static clientRepository = AppDataSource.getRepository(Client);

  static async getAll(req: Request, res: Response) {
    let bankers = await BankerController.bankerRepository
      .createQueryBuilder("banker")
      .leftJoinAndSelect("banker.clients", "client")
      .getMany();
    return res.json(bankers);
  }

  static async create(req: Request, res: Response) {
    const {
      first_name,
      last_name,
      email,
      card_number,
      employee_number,
      clients,
    } = req.body;

    const newBanker = new BankerValidator();
    newBanker.first_name = first_name;
    newBanker.last_name = last_name;
    newBanker.email = email;
    newBanker.card_number = card_number?.toString();
    newBanker.employee_number = employee_number;
    newBanker.clients = clients;

    // validate inputs
    const validationErrors = await validate(newBanker, {
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

    // check for duplicates
    if (
      await BankerController.bankerRepository.findOneBy({
        email,
        card_number,
        employee_number,
      })
    ) {
      return res.status(400).json({
        status: false,
        message: "email, card_number, and employee_number should be unique.",
      });
    }
    let banker = newBanker;

    if (newBanker.clients) {
      // get clients list
      const clientsList = await BankerController.clientRepository
        .createQueryBuilder("client")
        .where("client.id IN (:...clients)", { clients: newBanker.clients })
        .getMany();

      let banker = { ...newBanker, clients: clientsList };
    }

    try {
      await BankerController.bankerRepository.save(banker);

      res
        .status(201)
        .json({ status: true, message: "banker created successfully." });
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

    let foundBanker = await BankerController.bankerRepository.findOneBy({
      id,
    });
    if (!foundBanker) {
      return res
        .status(404)
        .json({ status: false, message: "banker does not exist." });
    }

    const {
      first_name,
      last_name,
      email,
      card_number,
      employee_number,
      clients,
    } = req.body;

    const newBanker = new BankerValidator();
    newBanker.first_name = first_name;
    newBanker.last_name = last_name;
    newBanker.email = email;
    newBanker.card_number = card_number?.toString();
    newBanker.employee_number = employee_number;
    newBanker.clients = clients;

    // validate inputs
    const validationErrors = await validate(newBanker, {
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

    // check for duplicates
    let isNotUnique = await BankerController.bankerRepository
      .createQueryBuilder("banker")
      .where(
        "banker.email = :email OR banker.card_number = :card_number OR banker.employee_number = :employee_number",
        { email, card_number, employee_number }
      )
      .getOne();

    if (isNotUnique) {
      return res.status(400).json({
        status: false,
        message: "email, card_number, and employee_number should be unique.",
      });
    }
    let banker = newBanker;

    if (newBanker.clients) {
      // get clients list
      const clientsList = await BankerController.clientRepository
        .createQueryBuilder("client")
        .where("client.id IN (:...clients)", { clients: newBanker.clients })
        .getMany();

      let banker = { ...newBanker, clients: clientsList };
    }

    Object.keys(banker).forEach((key) =>
      banker[key] === undefined
        ? delete banker[key]
        : (foundBanker[key] = banker[key])
    );

    try {
      await BankerController.bankerRepository.save(foundBanker);

      res
        .status(201)
        .json({ status: true, message: "banker updated successfully." });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    if (!parseInt(id)) {
      return res
        .status(404)
        .json({ status: false, message: "invalid id parameter." });
    }

    let foundBanker = await BankerController.bankerRepository.findOneBy({
      id,
    });

    if (!foundBanker) {
      return res
        .status(404)
        .json({ status: false, message: "banker does not exist." });
    }

    try {
      await BankerController.bankerRepository.softDelete({ id });

      res
        .status(201)
        .json({ status: true, message: "banker deleted successfully." });
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

    let foundBanker = await BankerController.bankerRepository.findOneBy({
      id,
    });

    if (!foundBanker) {
      return res
        .status(404)
        .json({ status: false, message: "banker does not exist." });
    } else {
      res.status(200).json(foundBanker);
    }
  }
}

export default BankerController;
