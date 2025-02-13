import Shipment from "@/models/Shipment";
import { DateTime } from "luxon";

const { MODE } = process.env;

export const generateWaybillNumber = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const randomLetter = () =>
    letters[Math.floor(Math.random() * letters.length)];
  const randomDigit = () => digits[Math.floor(Math.random() * digits.length)];

  return `${randomLetter()}${randomLetter()}${randomDigit()}${randomDigit()}${randomDigit()}${randomDigit()}${randomDigit()}${randomDigit()}${randomDigit()}${randomDigit()}${randomLetter()}${randomLetter()}`;
};

export interface IOrderProps {
  dateUpdated: string;
  dateCreated: string;
  orderId: string;
  clientOrderId: string;
  orderType: string;
  campaignId: number;
  campaignName: string;
  address1: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  shipCompanyName: string;
  shipAddress1: string;
  shipAddress2: string;
  shipCity: string;
  shipState: string;
  shipCountry: string;
  shipPostalCode: string;
}

export const order2shipment = async (order: IOrderProps) => {
  try {
    const existingShipment = await Shipment.findOne({
      orderId: order.orderId,
    });

    if (!existingShipment) {
      const newShipment = new Shipment({
        waybillNumber: generateWaybillNumber(),
        address: order.address1,
        deliveryContact: order.phoneNumber,
        orderId: order.orderId,
        customer: {
          firstname: order.firstName,
          lastname: order.lastName,
          email: order.emailAddress,
          phoneNumber: order.phoneNumber,
          companyName: order.shipCompanyName,
          address1: order.shipAddress1,
          address2: order.shipAddress2,
          city: order.shipCity,
          state: order.shipState,
          country: order.shipCountry,
          postalCode: order.shipPostalCode,
        },
        order: order,
        orderCreatedAt: fromZonedTime(order.dateCreated, "America/New_York"),
        orderUpdatedAt: fromZonedTime(order.dateUpdated, "America/New_York"),
      });

      await newShipment.save();
      console.log(
        "New shipment created successfully: ",
        newShipment.waybillNumber
      );
      if (MODE !== "production") console.log(newShipment);
      if (MODE !== "production")
        console.log(
          newShipment.orderCreatedAt.toLocaleDateString("en-US", {
            timeZone: "America/New_York",
          })
        );

      // if (flag) return;
      // flag = true;
      // sendInformEmails(newShipment);

      // // Send email to customer
      // await sendShipmentCreatedMail({
      //   customerEmail: order.emailAddress,
      //   waybillNumber: newShipment.waybillNumber,
      // });
    }
  } catch (error) {
    console.log((error as Error).message || error);
  }
};

export const fromZonedTime = (inputDate: string, timeZone: string) => {
  // Parse the string as New York time
  const luxonDateTime = DateTime.fromFormat(inputDate, "yyyy-MM-dd HH:mm:ss", {
    zone: timeZone,
  });

  // Convert to UTC and then to a JavaScript Date object
  return luxonDateTime.toUTC().toJSDate(); // MongoDB stores dates in UTC
};
