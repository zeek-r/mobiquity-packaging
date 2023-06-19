import { createInterface, Interface } from 'readline';
import { createReadStream } from 'fs';
import Reader from "./types";

class FileReader implements Reader {

    CreateReadStream(fileName: string): Interface {
        const file = createReadStream(fileName)
        const lineReader = createInterface({
            input: file,
        })
        return lineReader
    };
}

export default FileReader