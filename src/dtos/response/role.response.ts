import { Property } from "@tsed/schema";
import { Role } from "../../models/roles";

export class RoleResponse implements Role{

    @Property()
    id: string;

    @Property()
    roleName: string;

    @Property()
    roleDescription: string;

    @Property()
    createdAt: Date;

    @Property()
    createdBy: string;

    @Property()
    updatedAt: Date;

    @Property()
    updatedBy: string;
}