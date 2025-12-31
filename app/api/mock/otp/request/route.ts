import { NextResponse } from "next/server";

export async function POST() {
  // Simulasi delay 1.5 detik
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return NextResponse.json({
    status: "success",
    demo_code: "8888",
    message: "OTP sent to WhatsApp",
  });
}
