import { Property } from "@tsed/schema";

export class ItemRequest {
    @Property()
    id?: string;

    @Property()
    itemName: string;

    @Property()
    price: number;

    @Property()
    type: string;

    @Property()
    avatarId: string;

    @Property()
    createdAt?: string;

    @Property()
    createdBy?: string;

    @Property()
    updatedAt?: string;

    @Property()
    updatedBy?: string;
}