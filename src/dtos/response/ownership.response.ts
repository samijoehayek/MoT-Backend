import { Property } from "@tsed/schema";
import { UserResponse } from "./user.response";
import { User } from "../../models/user";
import { Item } from "../../models/item";
import { ItemResponse } from "./item.response";
import { Ownership } from "../../models/ownership";

export class OwnershipResponse implements Ownership{
    @Property()
    id!: string;

    @Property()
    userId: string;

    @Property(() => UserResponse)
    user: User;

    @Property()
    itemId: string;

    @Property(() => ItemResponse)
    item: Item;

    @Property()
    quantity: number;

    @Property()
    createdAt: Date;

    @Property()
    updatedAt: Date;
}