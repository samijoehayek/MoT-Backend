import { OrderProduct } from "../../models/orderProduct";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { registerProvider } from "@tsed/di";

export const OrderProductRepository = PostgresDataSource.getRepository(OrderProduct);
export const ORDER_PRODUCT_REPOSITORY = Symbol.for("OrderProductRepository");
export type ORDER_PRODUCT_REPOSITORY = typeof OrderProductRepository;

registerProvider({
    provide: ORDER_PRODUCT_REPOSITORY,
    useValue: OrderProductRepository,
});