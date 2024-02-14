import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserItem } from "./userItem";

@Entity()
export class Item {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  itemName!: string;

  @Column()
  itemNumber!: number;

  @Column({ nullable: true })
  itemRarity!: number;

  @OneToMany(() => UserItem, (userItem) => userItem.user)
  userItem: UserItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  createdBy!: string;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  updatedBy!: string;
}
