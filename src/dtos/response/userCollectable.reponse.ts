import { Property } from "@tsed/schema";
import { Collectable } from "../../models/collectable";
import { User } from "../../models/user";
import { UserCollectable } from "../../models/userCollectable";
import { UserResponse } from "./user.response";
import { CollectableResponse } from "./collectable.response";

export class UserCollectableResponse implements UserCollectable{
    @Property()
    id!: number;

    @Property()
    userId: string;

    @Property(() => UserResponse)
    user: User;

    @Property()
    collectableId: string;

    @Property(() => CollectableResponse)
    collectable: Collectable;

    @Property()
    createdAt: Date;

    @Property()
    updatedAt: Date;
    
}