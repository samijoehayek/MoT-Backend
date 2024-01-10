/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service } from "@tsed/di";
import * as crypto from "crypto";

@Service()
export class EncryptionService {
    public encryptMD5 = (value: any) => {
        return crypto.createHash("md5").update(value).digest("hex")
    }
}