import { Property } from "@tsed/schema";

export class CollectableRequest {
    @Property()
    id?: string;

    @Property()
    name: string;

    @Property()
    description: number;

    @Property()
    value: number;
}