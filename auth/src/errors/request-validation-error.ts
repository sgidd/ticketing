import { ValidationError } from "express-validator";

import { CustomError } from "./custom-error";

// interface CustomError {
//   statusCode: number;
//   serializeErrors: {
//     message: string;
//     field?: string;
//   }[];
// }
export class RequestValidaionError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");

    //below has to do when we are extending build in class and we wre writing in typescript
    Object.setPrototypeOf(this, RequestValidaionError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      if (err.type === "field") {
        return {
          message: err.msg,
          field: err.path,
        };
      }
      return { message: err.msg };
    });
  }
}
