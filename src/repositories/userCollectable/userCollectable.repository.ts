import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { UserCollectable } from "../../models/userCollectable";

export const UserCollectableRepository = PostgresDataSource.getRepository(UserCollectable);
export const USER_COLLECTABLE_REPOSITORY = Symbol.for("UserCollectableRepository");
export type USER_COLLECTABLE_REPOSITORY = typeof UserCollectableRepository;

registerProvider({
    provide: USER_COLLECTABLE_REPOSITORY,
    useValue: UserCollectableRepository,
});

