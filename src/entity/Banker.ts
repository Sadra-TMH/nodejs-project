import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { Person } from "./utils/Person";
import { Client } from "./Client";

@Entity("banker")
export class Banker extends Person {
  @Column({
    unique: true,
    length: 10,
  })
  employee_number: string;

  @ManyToMany(() => Client)
  @JoinTable({
    name: "bankers_clients",
    joinColumn: {
      name: "banker_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "client_id",
      referencedColumnName: "id",
    },
  })
  clients: Client[];
}
