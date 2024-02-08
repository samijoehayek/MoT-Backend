import { Controller, Inject } from "@tsed/di";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { ProductService } from "../../../app-services/product/product.service";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Exception } from "@tsed/exceptions";
import { ProductResponse } from "../../../dtos/response/product.response";
import { ProductRequest } from "../../../dtos/request/product.request";
import { Authenticate } from "@tsed/passport";

@Controller("/product")
@Tags("Product")
export class ProductController{
    @Inject(ProductService)            
    protected service: ProductService;

    @Get("/")
    @Returns(200, Array).Of(ProductResponse)
    public async getProduct(@QueryParams("filter") filter?: string): Promise<ProductResponse[]> {
        try {
            return filter ? await this.service.getProduct(JSON.parse(filter)) : await this.service.getProduct();
        } catch (error) {
            throw new Exception(error.status, error.message);
        }
    }

    @Post("/")
    @Authenticate("admin-passport")
    @Returns(200, ProductResponse)
    public async createProduct(@BodyParams() product: ProductRequest): Promise<ProductResponse> {
        try {
            return await this.service.createProduct(product);
        } catch (error) {
            throw new Exception(error.status, error.message);
        }
    }

    @Put("/:id")
    @Authenticate("admin-passport")
    @Returns(200, ProductResponse)
    public async updateProduct(@PathParams("id") id:string, @BodyParams() product: ProductRequest): Promise<ProductResponse> {
        try {
            return await this.service.updateProduct(id, product);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Authenticate("admin-passport")
    @Returns(200, Boolean)
    public async deleteProduct(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removeProduct(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}