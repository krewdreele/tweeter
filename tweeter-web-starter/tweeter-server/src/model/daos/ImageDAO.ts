export interface ImageDAO {
    upload(image: string): Promise<void>;
    getImage(userAlias: string): Promise<string>;
}