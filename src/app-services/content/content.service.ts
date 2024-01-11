import { Inject, Service } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { ContentRequest } from "../../dtos/request/content.request";
import { ContentResponse } from "../../dtos/response/content.response";
import { CONTENT_REPOSITORY } from "../../repositories/content/content.repository";

@Service()
export class ContentService {
    @Inject(CONTENT_REPOSITORY)
    protected contentRepository: CONTENT_REPOSITORY;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async getContent(filter?: any): Promise<Array<ContentResponse>> {
        const content = filter ? await this.contentRepository.find(filter) : await this.contentRepository.find();
        if(!content) return [];
        return content;
    }

    public async createContent(payload: ContentRequest): Promise<ContentResponse> {
        if(payload.id) payload.id = String(payload.id).toLowerCase();
        return await this.contentRepository.save({...payload});
    }

    public async updateContent(id: string, payload: ContentRequest): Promise<ContentResponse> {
        const content = await this.contentRepository.findOne({ where: { id: id } });
        if (!content)
            throw new NotFound("Content not found");

        id = id.toLowerCase();
        await this.contentRepository.update({ id: id }, { ...payload });

        return content;
    }

    public async removeContent(id: string): Promise<boolean> {
        id = id.toLowerCase();
        const content = await this.contentRepository.findOne({ where: { id: id } });
        if (!content)
            throw new NotFound("Content not found");

        await this.contentRepository.remove(content);
        return true;
    }
}
