import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Client } from "../entity/Client";
import { Banker } from "../entity/Banker";
import { ClientValidator } from "../utils/ClientValidator";
import { validate } from "class-validator";

class ClientController {
  private static clientRepository = AppDataSource.getRepository(Client);

  static async create(req: Request, res: Response) {
    const { first_name, last_name, email, card_number, balance } = req.body;

    const newClient = new ClientValidator();
    newClient.first_name = first_name;
    newClient.last_name = last_name;
    newClient.email = email;
    newClient.card_number = card_number?.toString();
    newClient.balance = parseInt(balance);

    const validationErrors = await validate(newClient, {
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

    if (
      await ClientController.clientRepository.findOneBy({
        email,
        card_number,
      })
    ) {
      return res.status(400).json({
        status: false,
        message: "email and card_number should be unique.",
      });
    }

    try {
      await ClientController.clientRepository.save(newClient);

      res
        .status(201)
        .json({ status: true, message: "client created successfully." });
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

    let foundClient = await ClientController.clientRepository.findOneBy({
      id,
    });
    if (!foundClient) {
      return res
        .status(404)
        .json({ status: false, message: "client does not exist." });
    }

    const { first_name, last_name, email, card_number, balance } = req.body;

    const newClient = new ClientValidator();
    newClient.first_name = first_name;
    newClient.last_name = last_name;
    newClient.email = email;
    newClient.card_number = card_number?.toString();
    newClient.balance = parseInt(balance);

    // validate inputs
    const validationErrors = await validate(newClient, {
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
    let isNotUnique = await ClientController.clientRepository
      .createQueryBuilder("client")
      .where("client.email = :email OR client.card_number = :card_number", {
        email,
        card_number,
      })
      .getOne();

    if (isNotUnique) {
      return res.status(400).json({
        status: false,
        message: "email and card_number should be unique.",
      });
    }
    let client = newClient;

    Object.keys(client).forEach((key) =>
      client[key] === undefined
        ? delete client[key]
        : (foundClient[key] = client[key])
    );

    try {
      await ClientController.clientRepository.save(foundClient);

      res
        .status(201)
        .json({ status: true, message: "client updated successfully." });
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

    let foundClient = await ClientController.clientRepository.findOneBy({
      id,
    });

    if (!foundClient) {
      return res
        .status(404)
        .json({ status: false, message: "client does not exist." });
    }

    try {
      await ClientController.clientRepository.softDelete({ id });

      res
        .status(201)
        .json({ status: true, message: "client deleted successfully." });
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

    let foundClient = await ClientController.clientRepository.findOneBy({
      id,
    });

    if (!foundClient) {
      return res
        .status(404)
        .json({ status: false, message: "client does not exist." });
    } else {
      res.status(200).json(foundClient);
    }
  }

  static async getAll(req: Request, res: Response) {
    let clients = await ClientController.clientRepository.find();
    return res.json(clients);
  }
}

export default ClientController;
