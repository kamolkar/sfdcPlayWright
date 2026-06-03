import fs from 'fs';
import path from 'path';

export class DataProvider{
   static getTestDataFromJson<T>(filepath: string): T {
        try {
            const absolutePath = path.resolve(filepath);
            const rawData = fs.readFileSync(absolutePath, 'utf8');
            return JSON.parse(rawData) as T;
        } catch (error: unknown) { 
            if (error instanceof Error) {
                throw new Error(`DataProvider Error: Failed to read or parse JSON at "${filepath}". Original error: ${error.message}`);
            }
            throw new Error(`DataProvider Error: An unknown error occurred at "${filepath}"`);
        }
    }
}



