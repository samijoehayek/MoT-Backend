import { Inject, Service } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { ProductRequest } from "../../dtos/request/product.request";
import { ProductResponse } from "../../dtos/response/product.response";
import { PRODUCT_REPOSITORY } from "../../repositories/product/product.repository";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { OWNERSHIP_REPOSITORY } from "../../repositories/ownership/ownership.repository";

@Service()
export class ProductService {
  @Inject(PRODUCT_REPOSITORY)
  protected productRepository: PRODUCT_REPOSITORY;

  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  @Inject(OWNERSHIP_REPOSITORY)
  protected ownershipRepository: OWNERSHIP_REPOSITORY;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getProduct(filter?: any): Promise<Array<ProductResponse>> {
    const product = filter ? await this.productRepository.find(filter) : await this.productRepository.find();
    if (!product) return [];
    return product;
  }

  public async createProduct(payload: ProductRequest): Promise<ProductResponse> {
    if (payload.id) payload.id = String(payload.id).toLowerCase();
    return await this.productRepository.save({ ...payload });
  }

  public async updateProduct(id: string, payload: ProductRequest): Promise<ProductResponse> {
    const product = await this.productRepository.findOne({ where: { id: id } });
    if (!product) throw new NotFound("Product not found");

    id = id.toLowerCase();
    await this.productRepository.update({ id: id }, { ...payload });

    return product;
  }

  public async removeProduct(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const product = await this.productRepository.findOne({ where: { id: id } });
    if (!product) throw new NotFound("Product not found");

    await this.productRepository.remove(product);
    return true;
  }
}
