import { Property } from "@tsed/schema";

export class ProductRequest{
    @Property() 
    id?: string;

    @Property() 
    name: string;

    @Property() 
    description: string;

    @Property() 
    price: number;

    @Property() 
    quantity: number;
    
    @Property() 
    available?: boolean;
}