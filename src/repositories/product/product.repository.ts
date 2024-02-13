import { Product } from "../../models/product";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { registerProvider } from "@tsed/di";

export const ProductRepository = PostgresDataSource.getRepository(Product);
export const PRODUCT_REPOSITORY = Symbol.for("ProductRepository");
export type PRODUCT_REPOSITORY = typeof ProductRepository;

registerProvider({
    provide: PRODUCT_REPOSITORY,
    useValue: ProductRepository,
});