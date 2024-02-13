import { Property } from "@tsed/schema";

export class OrderRequest {
    @Property()
    id?: string;

    @Property()
    userId: string;

    @Property()
    orderDate: Date;

    @Property()
    totalPrice: number;

    @Property()
    paymentStatus: string;
}