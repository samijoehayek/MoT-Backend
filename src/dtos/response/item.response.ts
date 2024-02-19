import { Property } from "@tsed/schema";
import { Item } from "../../models/item";
import { UserItem } from "../../models/userItem";
import { AvatarResponse } from "./avatar.response";

export class ItemResponse implements Item{    
    @Property()
    id: string;

    @Property()
    itemName: string;

    @Property()
    price: number;

    @Property()
    type: string;

    @Property()
    avatarId: string;

    @Property(() => AvatarResponse)
    avatar: AvatarResponse;

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