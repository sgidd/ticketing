import { ValidationError } from "express-validator";

export class RequestValidaionError extends Error {
  constructor(public errors: ValidationError[]) {
    super();

    //below has to do when we are extending build in class and we wre writing in typescript
    Object.setPrototypeOf(this, RequestValidaionError.prototype);
  }
}
