import { Inject, Service } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { PaymentConfigurationRequest } from "../../dtos/request/paymentConfiguration.request";
import { PaymentConfigurationResponse } from "../../dtos/response/paymentConfiguration.response";
import { PAYMENT_CONFIGURATION_REPOSITORY } from "../../repositories/paymentConfiguration/paymentConfiguration.repository";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
@Service()
export class PaymentConfigurationService {
  @Inject(PAYMENT_CONFIGURATION_REPOSITORY)
  protected paymentConfigurationRepository: PAYMENT_CONFIGURATION_REPOSITORY;

  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getPaymentConfiguration(filter?: any): Promise<Array<PaymentConfigurationResponse>> {
    const paymentConfiguration = filter ? await this.paymentConfigurationRepository.find(filter) : await this.paymentConfigurationRepository.find();
    if (!paymentConfiguration) return [];
    return paymentConfiguration;
  }

  public async createPaymentConfiguration(payload: PaymentConfigurationRequest): Promise<PaymentConfigurationResponse> {
    if (payload.id) payload.id = String(payload.id).toLowerCase();
    return await this.paymentConfigurationRepository.save({ ...payload });
  }

  public async updatePaymentConfiguration(id: string, payload: PaymentConfigurationRequest): Promise<PaymentConfigurationResponse> {
    const paymentConfiguration = await this.paymentConfigurationRepository.findOne({ where: { id: id } });
    if (!paymentConfiguration) throw new NotFound("PaymentConfiguration not found");

    id = id.toLowerCase();
    await this.paymentConfigurationRepository.update({ id: id }, { ...payload });

    return paymentConfiguration;
  }

  public async removePaymentConfiguration(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const paymentConfiguration = await this.paymentConfigurationRepository.findOne({ where: { id: id } });
    if (!paymentConfiguration) throw new NotFound("PaymentConfiguration not found");

    await this.paymentConfigurationRepository.remove(paymentConfiguration);
    return true;
  }
}
