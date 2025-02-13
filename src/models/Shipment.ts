import { IOrderProps } from "@/utils/order";
import mongoose, { ObjectId, Schema, model } from "mongoose";

interface ShipmentDocument {
  waybillNumber: string;
  address: string;
  deliveryContact: string;
  orderId: string;
  customer: {
    phoneNumber: string;
    firstname: string;
    lastname: string;
    companyName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    email: string;
  };
  order: IOrderProps & {
    [key: string]: string | number | Date | null | undefined;
  };
  orderCreatedAt: Date;
  orderUpdatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IShipmentProps extends ShipmentDocument {
  _id: ObjectId;
}

const ShipmentSchema = new Schema<ShipmentDocument>(
  {
    waybillNumber: {
      type: String,
      required: [true, "Waybill number is required"],
      unique: true,
    },
    address: {
      type: String,
    },
    deliveryContact: {
      type: String,
    },
    orderId: {
      type: String,
    },
    customer: {
      firstname: {
        type: String,
        required: [true, "Customer first name is required"],
      },
      lastname: {
        type: String,
        required: [true, "Customer last name is required"],
      },
      email: {
        type: String,
        required: [true, "Customer email is required"],
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Customer email is invalid",
        ],
      },
      phoneNumber: {
        type: String,
      },
      companyName: {
        type: String,
      },
      address1: {
        type: String,
      },
      address2: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
      postalCode: {
        type: String,
      },
    },
    order: {
      type: Object,
    },
    orderCreatedAt: {
      type: Date,
    },
    orderUpdatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Shipment =
  mongoose.models?.Shipment ||
  model<ShipmentDocument>("Shipment", ShipmentSchema);
export default Shipment;
