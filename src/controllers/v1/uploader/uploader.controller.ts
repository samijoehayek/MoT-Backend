import { Controller, Inject, MulterOptions, MultipartFile, PlatformMulterFile } from "@tsed/common";
import { Exception } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";
import { Post, Returns, Tags } from "@tsed/schema";
import { UploaderService } from "../../../app-services/uploader/uploader.service";

@Controller("/uploader")
@Tags("Uploader")
export class UploaderController {
    @Inject(UploaderService)
    protected service: UploaderService;

    @Post("/image")
    @Authenticate("admin-passport")
    @MulterOptions({ limits: { fileSize: 10000000 } })
    @Returns(200, String)
    async uploadImage(@MultipartFile("image") file: PlatformMulterFile): Promise<string> {
        try {
            return await this.service.uploadImage(file);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}