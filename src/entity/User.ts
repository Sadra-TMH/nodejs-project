import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column('boolean', {default: false})
  isAdmin: boolean = false;

  @Column('boolean', {default: false})
  isEditor: boolean = false;
}
