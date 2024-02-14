import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Collectable } from "./collectable";
import { User } from "./user";

@Entity()
export class UserCollectable {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;
  @ManyToOne(() => User, (user) => user.userCollectable)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  collectableId: string;
  @ManyToOne(() => Collectable, (collectable) => collectable.userCollectable)
  @JoinColumn({ name: "collectableId" })
  collectable: Collectable;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
