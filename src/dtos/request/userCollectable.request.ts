import { Property } from "@tsed/schema";

export class UserCollectableRequest {
    @Property()
    id?: string;

    @Property()
    userId: string;

    @Property()
    collectableId: string;

    @Property()
    quantity: number;

    @Property()
    createdAt?: string;

    @Property()
    updatedAt?: string;
}