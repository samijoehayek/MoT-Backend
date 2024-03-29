import { Property } from "@tsed/schema";
import { UserResponse } from "./user.response";
import { User } from "../../models/user";
import { Item } from "../../models/item";
import { ItemResponse } from "./item.response";
import { UserItem } from "../../models/userItem";

export class UserItemResponse implements UserItem{
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
    createdAt: Date;

    @Property()
    updatedAt: Date;
}