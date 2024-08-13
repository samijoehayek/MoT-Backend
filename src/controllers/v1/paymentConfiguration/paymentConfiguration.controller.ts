import { Controller, Inject } from "@tsed/di";
import { Exception } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { PaymentConfigurationResponse } from "../../../dtos/response/paymentConfiguration.response";
import { PaymentConfigurationRequest } from "../../../dtos/request/paymentConfiguration.request";
import { PaymentConfigurationService } from "../../../app-services/paymentConfiguration/paymentConfiguration.service";

@Controller("/payment-configuration")
@Tags("Payment Configuration")
export class PaymentConfigurationController {
    @Inject(PaymentConfigurationService)
    protected service: PaymentConfigurationService;

    @Get("/")
    @Authenticate("admin-passport")
    @(Returns(200, Array).Of(PaymentConfigurationResponse))
    public async getPaymentConfiguration(@QueryParams("filter") filter?: string): Promise<PaymentConfigurationResponse[]> {
        try {
            return filter ? await this.service.getPaymentConfiguration(JSON.parse(filter)) : await this.service.getPaymentConfiguration();
        } catch (error) {
            throw new Exception(error.status, error.message);
        }
    }

    @Post("/")
    @Authenticate("admin-passport")
    @Returns(200, PaymentConfigurationResponse)
    public async createProduct(@BodyParams() product: PaymentConfigurationRequest): Promise<PaymentConfigurationResponse> {
        try {
            return await this.service.createPaymentConfiguration(product);
        } catch (error) {
            throw new Exception(error.status, error.message);
        }
    }

    @Put("/:id")
    @Authenticate("admin-passport")
    @Returns(200, PaymentConfigurationResponse)
    public async updateProduct(@PathParams("id") id:string, @BodyParams() product: PaymentConfigurationRequest): Promise<PaymentConfigurationResponse> {
        try {
            return await this.service.updatePaymentConfiguration(id, product);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Authenticate("admin-passport")
    @Returns(200, Boolean)
    public async delete(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removePaymentConfiguration(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}
