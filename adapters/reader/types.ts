import { ReadStream } from "fs";
import { Interface } from "readline";

interface Reader {
    CreateReadStream(fileName: String): Interface;
}

export default Reader;