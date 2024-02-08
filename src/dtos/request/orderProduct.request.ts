import { Property } from "@tsed/schema";

export class OrderProductRequest{
    @Property() 
    id?: string;

    @Property()
    orderId: string;

    @Property() 
    productId: string;

    @Property() 
    quantity: number;

}