"use server";
import { getStages } from "@/actions/stage";
import { IShipmentProps } from "@/models/Shipment";
import { StageDocument } from "@/models/Stage";
import nodemailer from "nodemailer";
import { deadline2seconds } from "./time";
import { shortCodeParsed } from "@/utils/text";
import { MailerSend, EmailParams, Recipient, Sender } from "mailersend";

const {
  SMTP_SERVER_HOST,
  SMTP_SERVER_USERNAME,
  SMTP_SERVER_PASSWORD,
  SITE_MAIL_RECIEVER,
  MAILER_SEND_API_TOKEN,
} = process.env;
const transporter = nodemailer.createTransport({
  host: SMTP_SERVER_HOST,
  port: 587,
  secure: false,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

export async function sendMail({
  email,
  sendTo,
  subject,
  text,
  html,
}: {
  email: string;
  sendTo?: string;
  subject: string;
  text: string;
  html?: string;
}) {
  try {
    await transporter.verify();
  } catch (error) {
    console.error(
      "Something Went Wrong",
      SMTP_SERVER_USERNAME,
      SMTP_SERVER_PASSWORD,
      error
    );
    return;
  }

  const info = await transporter.sendMail({
    from: email,
    to: sendTo || SITE_MAIL_RECIEVER,
    subject: subject,
    text: text,
    html: html ? html : "",
  });
  console.log("Message Sent", info.messageId);
  console.log("Mail sent to", sendTo || SITE_MAIL_RECIEVER);
  return info;
}

export async function sendShipmentCreatedMail({
  customerEmail,
  waybillNumber,
}: {
  customerEmail: string;
  waybillNumber: string;
}) {
  const subject = "Your Shipment Has Been Created";
  const text = `Dear Customer,

We are pleased to inform you that your shipment has been created successfully. Your waybill number is ${waybillNumber}.

Thank you for choosing our service.

Best regards,
Parcel Tracking Team`;

  const info = await sendMail({
    email: SITE_MAIL_RECIEVER || "support@swifttrack.com",
    sendTo: customerEmail,
    subject: subject,
    text: text,
  });
  console.log("Shipment creation email sent", info?.messageId);
  return info;
}

export const sendInformEmails = async (shipment: IShipmentProps) => {
  try {
    const result = await getStages();
    if (result.error || !result.stages) return;
    const stages = JSON.parse(result.stages);
    stages.forEach((stage: StageDocument) => {
      if (!stage.sendEmail) return;
      console.log(
        `Email will be sent to ${
          shipment.customer.email
        } after ${deadline2seconds(stage)} seconds.`
      );
      setTimeout(() => {
        sendMailByAPI({
          email: SITE_MAIL_RECIEVER || "support@swifttrack.com",
          // sendTo: "barnault0325@gmail.com" || shipment.customer.email,
          sendTo: "barnault0325@gmail.com",
          subject: shortCodeParsed(shipment, stage.text),
          text: shortCodeParsed(shipment, stage.emailContent),
        });
      }, deadline2seconds(stage) * 1000);
    });
  } catch (error) {
    console.log((error as Error).message || error);
  }
};

export const sendMailByAPI = async ({
  email,
  sendTo,
  subject,
  text,
  html,
}: {
  email: string;
  sendTo?: string;
  subject: string;
  text: string;
  html?: string;
}) => {
  const mailersend = new MailerSend({
    apiKey: MAILER_SEND_API_TOKEN || "key",
  });

  const recipients = [
    new Recipient(sendTo as string, "Recipient"),
    new Recipient("skybigstar1990@gmail.com", "Sky Bigstar"),
  ];

  const emailParams = new EmailParams()
    .setFrom(
      new Sender(
        SITE_MAIL_RECIEVER ||
          email ||
          "support@trial-o65qngkn5n3gwr12.mlsender.net",
        "Mail Test Support Team"
      )
    )
    .setTo(recipients)
    .setSubject(subject)
    .setHtml(html as string)
    .setText(text);

  await mailersend.email.send(emailParams);
};
