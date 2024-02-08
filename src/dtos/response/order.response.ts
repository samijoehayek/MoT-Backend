import { Property } from "@tsed/schema";
import { Order } from "src/models/order";
import { UserResponse } from "./user.response";
import { User } from "../../models/user";

export class OrderResponse implements Order {
    @Property()
    id!: string;

    @Property()
    userId!: string;

    @Property(() => UserResponse)
    user: User;

    @Property()
    orderDate: Date;

    @Property()
    totalPrice: number;

    @Property()
    paymentStatus: string;
}