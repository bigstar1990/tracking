import { IShipmentProps } from "@/models/Shipment";

export function shortCodeParsed(
  shipment: IShipmentProps,
  text: string
): string {
  return text
    .replace(
      /\[customer\]/g,
      `${shipment.customer.firstname} ${shipment.customer.lastname}`
    )
    .replace(
      /\[home address\]/g,
      `${shipment.customer.address1 ?? ""} ${shipment.customer.address2 ?? ""}`
    )
    .replace(/\[customer's country\]/g, `${shipment.customer.country}`)
    .replace(/\[phone number\]/g, `${shipment.customer.phoneNumber}`);
}
