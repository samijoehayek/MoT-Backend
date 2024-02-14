import { Column, PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Role } from "./role";
import { UserItem } from "./userItem";
import { Avatar } from "./avatar";
import { UserCollectable } from "./userCollectable";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  tag: string;

  // Add foreign key from the roles table
  @Column({ nullable: true })
  roleId: string;
  @ManyToOne(() => Role, (role: Role) => role.id)
  @JoinColumn({ name: "roleId" })
  role: Role;

  // Add foreign key from the avatar table
  @Column({ nullable: true })
  avatarId: string;
  @ManyToOne(() => Avatar, (avatar: Avatar) => avatar.id)
  @JoinColumn({ name: "avatarId" })
  avatar: Avatar;

  @OneToMany(() => UserItem, (userItem) => userItem.user)
  userItem: UserItem[];

  // One collectable can have many instances for users to collect
  @OneToMany(() => UserCollectable, (userCollectable) => userCollectable.user)
  userCollectable: UserCollectable[];

  @Column({ default: 0 })
  balance: number;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updateAt: Date;
}
