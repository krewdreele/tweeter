import { ImageDAO } from "../ImageDAO";

export class S3DAO implements ImageDAO {
    upload(image: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getImage(userAlias: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    
}