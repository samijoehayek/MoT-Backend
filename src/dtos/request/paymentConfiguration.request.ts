import { Property } from "@tsed/schema";

export class PaymentConfigurationRequest {
    @Property()
    id?: string;

    @Property()
    userId: string;

    @Property()
    paymentType: string;
    
    @Property()
    token: string;
}