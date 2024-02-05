import { Item } from "../../models/item";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { registerProvider } from "@tsed/di";

export const ItemRepository = PostgresDataSource.getRepository(Item);
export const ITEM_REPOSITORY = Symbol.for("ItemRepository");
export type ITEM_REPOSITORY = typeof ItemRepository;

registerProvider({
    provide: ITEM_REPOSITORY,
    useValue: ItemRepository,
});