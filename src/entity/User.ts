import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column('boolean', {default: false})
  isAdmin: boolean = false;

  @Column('boolean', {default: false})
  isEditor: boolean = false;
}
