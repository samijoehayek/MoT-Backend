import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class PaymentConfiguration {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;
  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  paymentType!: string;

// This token will represent the user's payment details tokenized by the payment gateway
  @Column()
  token!: string;
}
