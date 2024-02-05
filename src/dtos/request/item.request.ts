import { Property } from "@tsed/schema";

export class ItemRequest {
    @Property()
    id?: string;

    @Property()
    itemName: string;

    @Property()
    itemNumber: number;

    @Property()
    itemRarity: number;

    @Property()
    createdAt?: string;

    @Property()
    createdBy?: string;

    @Property()
    updatedAt?: string;

    @Property()
    updatedBy?: string;
}