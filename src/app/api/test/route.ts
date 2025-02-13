import { NextResponse } from "next/server";
import { sendMail } from "@/lib/send-mail";

// ...existing code...

export async function GET() {
  try {
    await sendMail({
      email: "test@example.com",
      sendTo: "000workemail000@gmail.com",
      subject: "Test Email",
      text: "This is a test email.",
    });
    return NextResponse.json({ message: "Test email sent successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to send test email", error });
  }
}

// ...existing code...
