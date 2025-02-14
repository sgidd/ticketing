import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

import { OrderStatus } from "@sgidd-tickets/common";

//list of props to be provided while building an order
interface OrderAttrs {
  id: string;
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
}

//list of props that an order has
interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
}

//list of porps model has - list of custom methods
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

//tells to use version key instead _v
orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
