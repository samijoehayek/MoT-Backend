import { Property } from "@tsed/schema";
import { PaymentConfiguration } from "src/models/paymentConfiguration";
import { User } from "src/models/user";

export class PaymentConfigurationResponse implements PaymentConfiguration {
    @Property()
    id!: string;

    @Property()
    userId: string;

    @Property(() => User)
    user: User;

    @Property()
    paymentType!: string;

    @Property()
    token: string; 

}