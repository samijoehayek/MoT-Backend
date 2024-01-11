import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({unique:true})
    roleName!: string;

    @Column({nullable:true})
    roleDescription!: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({nullable:true})
    createdBy!: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updatedAt!: Date;

    @Column({nullable:true})
    updatedBy!: string;
}