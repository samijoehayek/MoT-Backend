import { Property } from "@tsed/schema";

export class ItemResponse {
    @Property()
    id: string;

    @Property()
    itemName: string;

    @Property()
    itemNumber: number;

    @Property()
    itemRarity: number;

    @Property()
    createdAt: Date;

    @Property()
    createdBy: string;

    @Property()
    updatedAt: Date;

    @Property()
    updatedBy: string;
}