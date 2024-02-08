import { PaymentConfiguration } from "../../models/paymentConfiguration";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { registerProvider } from "@tsed/di";

export const PaymentConfigurationRepository = PostgresDataSource.getRepository(PaymentConfiguration);
export const PAYMENT_CONFIGURATION_REPOSITORY = Symbol.for("PaymentConfigurationRepository");
export type PAYMENT_CONFIGURATION_REPOSITORY = typeof PaymentConfigurationRepository;

registerProvider({
    provide: PAYMENT_CONFIGURATION_REPOSITORY,
    useValue: PaymentConfigurationRepository,
});