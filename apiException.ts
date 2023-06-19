class APIException extends Error {
    errors: any;
    constructor(message: string, optDetails?: any) {
        super(message);
        this.name = "APIException";
        this.errors = {
            ...optDetails,
        };
    }
};

export default APIException;