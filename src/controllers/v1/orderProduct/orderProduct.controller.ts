import { Controller, Inject } from "@tsed/di";
import { Exception } from "@tsed/exceptions";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Get, Post, Put, Returns, Tags, Delete } from "@tsed/schema";
import { OrderProductService } from "../../../app-services/orderProduct/orderProduct.service";
import { OrderProductResponse } from "../../../dtos/response/orderProduct.response";
import { OrderProductRequest } from "../../../dtos/request/orderProduct.request";
import { Authenticate } from "@tsed/passport";

@Controller("/order-product")
@Tags("Order Product")
export class OrderProductController {
    @Inject(OrderProductService)
    protected service: OrderProductService;

    @Get("/")
    @Authenticate("jwt-passport")
    @(Returns(200, Array).Of(OrderProductResponse))
    public async getOrderProduct(@QueryParams("filter") filter?: string): Promise<OrderProductResponse[]> {
        try {
            return filter ? await this.service.getOrderProduct(JSON.parse(filter)) : await this.service.getOrderProduct();
        } catch (error) {
            throw new Exception(error.status, error.message);
        }
    }

    @Post("/")
    @Authenticate("jwt-passport")
    @Returns(200, OrderProductResponse)
    public async createOrderProduct(@BodyParams() orderProduct: OrderProductRequest[]): Promise<OrderProductResponse[]> {
        try {
            return await this.service.createOrderProduct(orderProduct);
        } catch (error) {
            throw new Exception(error.status, error.message);
        }
    }

    @Put("/:id")
    @Authenticate("jwt-passport")
    @Returns(200, OrderProductResponse)
    public async updateOrderProduct(@PathParams("id") id:string, @BodyParams() orderProduct: OrderProductRequest): Promise<OrderProductResponse> {
        try {
            return await this.service.updateOrderProduct(id, orderProduct);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Authenticate("jwt-passport")
    @Returns(200, Boolean)
    public async deleteOrderProduct(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removeOrderProduct(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

}