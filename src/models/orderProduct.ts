import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order";
import { Product } from "./product";

@Entity()
export class OrderProduct {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    orderId!: string;
    @ManyToOne(() => Order, (order: Order) => order.id)
    @JoinColumn({ name: "orderId" })
    order: Order;

    @Column()
    productId!: string;
    @ManyToOne(() => Product, (product: Product) => product.id)
    @JoinColumn({ name: "productId" })
    product: Product;

    @Column()
    quantity!: number;

}