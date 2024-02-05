import { Ownership } from "../../models/ownership";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { registerProvider } from "@tsed/di";

export const OwnershipRepository = PostgresDataSource.getRepository(Ownership);
export const OWNERSHIP_REPOSITORY = Symbol.for("OwnershipRepository");
export type OWNERSHIP_REPOSITORY = typeof OwnershipRepository;

registerProvider({
    provide: OWNERSHIP_REPOSITORY,
    useValue: OwnershipRepository,
});