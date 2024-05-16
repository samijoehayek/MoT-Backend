import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { UserSession } from "../../models/userSession"

export const UserSessionRepository = PostgresDataSource.getRepository(UserSession);
export const USER_SESSION_REPOSITORY = Symbol.for("UserSessionRepository");
export type USER_SESSION_REPOSITORY = typeof UserSessionRepository;

registerProvider({
    provide: USER_SESSION_REPOSITORY,
    useValue: UserSessionRepository,
});