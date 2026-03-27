import { NextResponse } from "next/server";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]); // Add this here too!
import nodemailer from "nodemailer";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    // 1. Type the incoming body
    const { email, password }: { email?: string; password?: string } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Password requirements: 8+ chars, 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Char
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

if (!passwordRegex.test(password)) {
  return NextResponse.json(
    { error: "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character." },
    { status: 400 }
  );
}

    // 2. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

   // 4. Generate a 6-digit OTP
const otp = Math.floor(100000 + Math.random() * 900000).toString();
const tokenExpiry = new Date(Date.now() + 600000); // 10 minutes is safer for OTP

// 5. Create User
await User.create({
  email,
  password: hashedPassword,
  verificationToken: otp, // Store the OTP here
  verificationTokenExpiry: tokenExpiry,
});

// Logging for dev (This is what you'll type into the UI)
console.log(`OTP for ${email}: ${otp}`);
// 1. Setup the Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 2. Compose the Email
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: email,
  subject: "Your Verification Code",
  text: `Your 6-digit verification code is: ${otp}. It expires in 10 minutes.`,
  html: `<h1>Verification Code</h1><p>Your code is: <strong>${otp}</strong></p>`,
};

// 3. Send it
await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "User registered. Please verify email." }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Error registering user" }, { status: 500 });
  }
}
