import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @CreateDateColumn()
    createdAt!: Date;

    @Column({nullable:true})
    createdBy!: string;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({nullable:true})
    updatedBy!: string;
}