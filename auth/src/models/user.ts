import mongoose from "mongoose";
import { Password } from "../services/password";

//an interface that describes the properties
//that are required to create a new user

interface UserAttrs {
  email: string;
  password: string;
}

//interface that describes the properties that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): any;
}

//interface describes properties user document has which will be returned when fetched user details
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  //   createdAt: string;
  //   updatedAt: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret.password;
        delete ret.__v;
        delete ret._id;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});
userSchema.statics.build = (attrs: UserAttrs) => {
  console.log(attrs);
  console.log(new User(attrs));
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

//as per mongo we use new of User Model to create new user but typescript cant do type check
//so using below function and interface

// const buildUser = (attrs: UserAttrs) => {
//   return new User(attrs);
// };

//re writing above builduser for no need to rememeber for developer to call the func
//writing method on user modle it self

//this code moved above as it was failing while calling from index
// userSchema.statics.build = (attrs: UserAttrs) => {
//     return new User(attrs);
//   };

//below line gives typecript error as build is not exist on model
// so adding inetrface to add the method to the model
//now we can call build like below
// User.build({
//   email: "test@test.com",
//   password: "password",
// });

export { User };
