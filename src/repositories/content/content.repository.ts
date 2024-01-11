import { Content } from "../../models/content";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { registerProvider } from "@tsed/di";

export const ContentRepository = PostgresDataSource.getRepository(Content);
export const CONTENT_REPOSITORY = Symbol.for("ContentRepository");
export type CONTENT_REPOSITORY = typeof ContentRepository;

registerProvider({
    provide: CONTENT_REPOSITORY,
    useValue: ContentRepository,
});