import { Property } from "@tsed/schema";
import { Collectable } from "../../models/collectable";
import { UserCollectable } from "../../models/userCollectable";

export class CollectableResponse implements Collectable{
   
    @Property()
    id: string;

    @Property()
    name: string;

    @Property()
    description: string;

    @Property()
    value: number;

    @Property()
    userCollectable: UserCollectable[];
}