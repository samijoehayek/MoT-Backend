import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserCollectable } from "./userCollectable";

@Entity()
export class Collectable {
  @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    value: number;

    // One collectable can have many instances for users to collect
    @OneToMany(() => UserCollectable, (userCollectable) => userCollectable.collectable)
    userCollectable: UserCollectable[];
}