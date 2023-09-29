import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
const dotenv = require("dotenv");
dotenv.config();

const rolesMapper = { admin: "isAdmin", editor: "isEditor" };

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.sendStatus(401);
    let username = req.user;

    const userRepository = AppDataSource.getRepository(User);
    const foundUser = await userRepository.findOneBy({ username });
    if (!foundUser) return res.sendStatus(401);

    let rolesCheck = roles.map((role: string) => {
      if (rolesMapper[role]) {
        let isRoleValid = Object.getOwnPropertyDescriptor(
          foundUser,
          rolesMapper[role]
        );
        return isRoleValid.value
      }
    });
    if (rolesCheck.find((val) => val === true)) {
      next();
    } else {
      return res.sendStatus(401);
    }
  };
};
