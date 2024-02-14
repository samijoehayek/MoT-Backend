import { Property } from '@tsed/schema';

export class UserItemRequest {
    @Property()
    id?: string;

    @Property()
    userId: string;

    @Property()
    itemId: string;

    @Property()
    createdAt?: string;

    @Property()
    updatedAt?: string;
}