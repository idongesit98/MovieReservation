type Status = "success" | "error"
export interface ApiResponse {
    code:number,
    status: Status,
    message:string,
    data: object | null,
    error: SerializedError | null
}

export interface SerializedError {
    name:string;
    message:string;
    stack?:string
}

export const successResponse = (code:number,message:string,data:object | null):ApiResponse =>{
    return{
        code,
        status:"success",
        message,
        data,
        error:null
    }
}

export const errorResponse = (code:number,message:string,data:object | null,error?:unknown):ApiResponse =>{
    let serializedError:SerializedError | null = null;

    if (error instanceof Error) {
        serializedError = {
            name:error.name,
            message:error.message,
            stack:error.stack
        };
    }else if(typeof error === "string"){
        serializedError = {
            name:"Error",
            message:error
        };
    }else if (error && typeof error === "object") {
        serializedError = {
            name:"Error",
            message:JSON.stringify(error)
        };
    }
    return{
        code,
        status:'error',
        message,
        data,
        error:serializedError
    };
};