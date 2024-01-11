import { Controller, Inject } from "@tsed/di";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { ContentService } from "../../../app-services/content/content.service";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Exception } from "@tsed/exceptions";
import { ContentResponse } from "../../../dtos/response/content.response";
import { ContentRequest } from "../../../dtos/request/content.request";

@Controller("/content")
@Tags("Content")
export class ContentController{
    @Inject(ContentService)
    protected service: ContentService;

    @Get("/")
    @Returns(200, Array).Of(ContentResponse)
    public async getContent(@QueryParams("filter") filter?: string): Promise<ContentResponse[]> {
        try {
            return filter ? await this.service.getContent(JSON.parse(filter)) : await this.service.getContent();
        } catch (error) {
            throw new Exception(error.status, error.message);
        }
    }

    @Post("/")
    @Returns(200, ContentResponse)
    public async createContent(@BodyParams() content: ContentRequest): Promise<ContentResponse> {
        try {
            return await this.service.createContent(content);
        } catch (error) {
            throw new Exception(error.status, error.message);
        }
    }

    @Put("/:id")
    @Returns(200, ContentResponse)
    public async updateContent(@PathParams("id") id:string, @BodyParams() content: ContentRequest): Promise<ContentResponse> {
        try {
            return await this.service.updateContent(id, content);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Returns(200, Boolean)
    public async deleteContent(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removeContent(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

}