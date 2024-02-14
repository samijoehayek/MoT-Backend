import { UserItem } from "../../models/userItem";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { registerProvider } from "@tsed/di";

export const UserItemRepository = PostgresDataSource.getRepository(UserItem);
export const USER_ITEM_REPOSITORY = Symbol.for("UserItemRepository");
export type USER_ITEM_REPOSITORY = typeof UserItemRepository;

registerProvider({
    provide: USER_ITEM_REPOSITORY,
    useValue: UserItemRepository,
});