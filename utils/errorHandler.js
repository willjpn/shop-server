export class CustomError extends Error {
    constructor(message, errorCode = 500) {
        super(message)
        this.status = errorCode
    }
}
