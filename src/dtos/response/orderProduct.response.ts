import { Property } from "@tsed/schema";
import { OrderProduct } from "src/models/orderProduct";
import { OrderResponse } from "./order.response";
import { Order } from "src/models/order";
import { Product } from "src/models/product";
import { ProductResponse } from "./product.response";

export class OrderProductResponse implements OrderProduct {
    @Property()
    id!: string;

    @Property()
    orderId!: string;

    @Property(() => OrderResponse)
    order: Order;

    @Property()
    productId: string;

    @Property(() => ProductResponse)
    product: Product;

    @Property()
    quantity: number;
}