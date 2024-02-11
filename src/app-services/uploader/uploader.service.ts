import { PlatformMulterFile } from "@tsed/common";
import { Service } from "@tsed/di";
import { randomUUID } from "crypto";
import * as fs from "fs";
import path from "path";
import { envs } from "../../config/envs";

@Service()
export class UploaderService {
    public async uploadImage(image: PlatformMulterFile): Promise<string> {
        const readFile=fs.readFileSync(image.path);
        const randUUID = randomUUID();
        const filePath = path.resolve(__dirname, `../../public/content/${randUUID}` + path.extname(image.originalname));

        const returnPath = envs.PUBLIC_FOLDER + `/contetnt/${randUUID}` + path.extname(image.originalname);
        fs.writeFileSync(filePath, Buffer.from(readFile));
        return returnPath;
    }
}