import { Column, PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Role } from "./role";
import { Ownership } from "./ownership";

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
  @ManyToOne(() => Role, (role:Role) => role.id)
  @JoinColumn({ name: "roleId" })
  role: Role;

  @OneToMany(() => Ownership, (ownership) => ownership.user)
  ownership: Ownership[];

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
