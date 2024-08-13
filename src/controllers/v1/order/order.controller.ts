import { Controller, Inject } from "@tsed/di";
import { Exception } from "@tsed/exceptions";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Get, Post, Put, Returns, Tags, Delete } from "@tsed/schema";
import { OrderService } from "../../../app-services/order/order.service";
import { OrderResponse } from "../../../dtos/response/order.response";
import { OrderRequest } from "../../../dtos/request/order.request";
import { Authenticate } from "@tsed/passport";

@Controller("/order")
@Tags("Order")
export class OrderController {
    @Inject(OrderService)
    protected service: OrderService;

    @Get("/")
    @Authenticate("jwt-passport")
    @(Returns(200, Array).Of(OrderResponse))
    public async getOrder(@QueryParams("filter") filter?: string): Promise<OrderResponse[]> {
        try {
            return filter ? await this.service.getOrder(JSON.parse(filter)) : await this.service.getOrder();
        } catch (error) {
            throw new Exception(error.status, error.message);
        }
    }

    @Post("/")
    @Authenticate("jwt-passport")
    @Returns(200, OrderResponse)
    public async createOrder(@BodyParams() order: OrderRequest): Promise<OrderResponse> {
        try {
            return await this.service.createOrder(order);
        } catch (error) {
            throw new Exception(error.status, error.message);
        }
    }

    @Put("/:id")
    @Authenticate("jwt-passport")
    @Returns(200, OrderResponse)
    public async updateOrder(@PathParams("id") id:string, @BodyParams() order: OrderRequest): Promise<OrderResponse> {
        try {
            return await this.service.updateOrder(id, order);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Authenticate("jwt-passport")
    @Returns(200, Boolean)
    public async deleteOrder(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removeOrder(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Put("success/:id")
    @Authenticate("jwt-passport")
    @Returns(200, OrderResponse)
    public async updateOrderSuccess(@PathParams("id") id:string, @BodyParams() products: {productId:string, quantity:number}[]): Promise<OrderResponse> {
        try {
            return await this.service.updateOrderSuccess(id, products);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}