import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class UserSession {
  // Add properties for the UserSession entity
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // Add foreign key from the user table
  @Column()
  userId: string;
  @OneToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ unique: true })
  sessionToken!: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  lastPingAt: Date;
  
}