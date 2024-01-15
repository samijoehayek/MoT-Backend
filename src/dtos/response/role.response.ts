import { Property } from "@tsed/schema";
import { Role } from "../../models/roles";
import { User } from "src/models/user";

export class RoleResponse implements Role{

    @Property()
    id: string;

    @Property()
    roleName: string;

    @Property()
    roleDescription: string;

    @Property()
    user: User[];

    @Property()
    createdAt: Date;

    @Property()
    createdBy: string;

    @Property()
    updatedAt: Date;

    @Property()
    updatedBy: string;
}