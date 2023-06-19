class FileNotFoundException extends Error {
    errors: any;
    constructor(message: string, optDetails?: any) {
        super(message);
        this.name = "FileNotFound";
        this.errors = {
            ...optDetails,
        };
    }
};

export default FileNotFoundException;