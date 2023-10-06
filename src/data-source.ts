import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Client } from "./entity/Client";
import { Banker } from "./entity/Banker";
import { Transaction } from "./entity/Transaction";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "node",
  password: "node",
  database: "app1",
  synchronize: true,
  logging: false,
  entities: [User, Client, Banker, Transaction],
  migrations: [],
  subscribers: [],
});
