import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Ownership } from "./ownership";

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

  @OneToMany(() => Ownership, (ownership) => ownership.user)
  ownership: Ownership[];

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  createdBy!: string;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  updatedBy!: string;
}
