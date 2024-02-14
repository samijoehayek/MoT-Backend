import { Property } from "@tsed/schema";
import { Item } from "../../models/item";
import { UserItem } from "../../models/userItem";

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
    userItem: UserItem[];

    @Property()
    createdAt: Date;

    @Property()
    createdBy: string;

    @Property()
    updatedAt: Date;

    @Property()
    updatedBy: string;
}