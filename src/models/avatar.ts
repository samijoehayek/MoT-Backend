import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Avatar {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name: string;

    @Column()
    gender: string;

    @Column({unique: true})
    model: number;

    @OneToMany(() => User, (user) => user.role)
    user!: User[];
}