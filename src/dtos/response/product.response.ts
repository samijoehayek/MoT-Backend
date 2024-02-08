import { Property } from "@tsed/schema";
import { Product } from "../../models/product";

export class ProductResponse implements Product {
    @Property()
    id!: string;

    @Property()
    name: string;

    @Property()
    description: string;

    @Property()
    price: number;

    @Property()
    quantity: number;

    @Property()
    available: boolean;
}