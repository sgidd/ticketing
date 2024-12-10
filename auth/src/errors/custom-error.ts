// abstarct class
// - can not be instantiated
// - used to set up requirements for subclasses
// - doe create a class when translated to js , which means we can use it in 'instanceof' checks
export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message); //equivalent to new Error()
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}

//passing message to Error becoz it will atleast have the string passed
//becox we throw we do domething like below
//throw new Error('some msg)
