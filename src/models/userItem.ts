import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./user";
import { Item } from "./item";

// This model is used to represent the user items of an collectable item by a user
@Entity()
export class UserItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;
  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  itemId!: string;
  @ManyToOne(() => Item, (item: Item) => item.id)
  @JoinColumn({ name: "itemId" })
  item: Item;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
