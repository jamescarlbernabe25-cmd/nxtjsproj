import { NextResponse } from "next/server";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]); // Add this at the top
import dbConnect from "@/lib/db";
import User from "@/models/User";

// 1. Explicitly type the request as 'Request' from Next.js
export async function POST(req: Request) {
  try {
    await dbConnect();
    
    // 2. Type the destructured body
    const { token }: { token: string } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // 3. Finding the user
    // If you haven't typed your User model yet, 'user' will be 'any'. 
    // Once we fix User.ts, this will get full autocomplete.
    const user = await User.findOne({ 
      verificationToken: token, 
      verificationTokenExpiry: { $gt: Date.now() } 
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // 4. Update fields
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: "Email verified successfully!" }, { status: 200 });

  } catch (error) {
    // 5. Basic error handling with TS
    console.error("Verification Error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
