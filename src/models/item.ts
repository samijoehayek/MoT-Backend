import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserItem } from "./userItem";
import { Avatar } from "./avatar";

@Entity()
export class Item {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  itemName!: string;

  @Column()
  price!: number;

  @Column()
  type: string;

  @Column()
  avatarId!: string;
  @ManyToOne(() => Avatar, (avatar: Avatar) => avatar.id)
  @JoinColumn({ name: "avatarId" })
  avatar: Avatar;

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
