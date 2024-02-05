import { Property } from "@tsed/schema";
import { Item } from "../../models/item";
import { Ownership } from "src/models/ownership";

export class ItemResponse implements Item{
    
    @Property()
    id: string;

    @Property()
    itemName: string;

    @Property()
    itemNumber: number;

    @Property()
    itemRarity: number;

    @Property()
    ownership: Ownership[];

    @Property()
    createdAt: Date;

    @Property()
    createdBy: string;

    @Property()
    updatedAt: Date;

    @Property()
    updatedBy: string;
}