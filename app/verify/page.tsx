"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(60); // 60-second resend timer
  const router = useRouter();

  // Handle Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

   const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setMessage("Please enter all 6 digits."); // Changed from setError
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: otp }), 
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Email verified! Redirecting...");
        setTimeout(() => router.push("/signin"), 2000);
      } else {
        setStatus("error");
        setMessage(data.error || "Invalid or expired OTP.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Connection error. Please try again.");
    }
  };


  const handleResend = async () => {
    if (timer > 0) return;
    // Logic to call your resend API would go here
    setTimer(60);
    setMessage("A new code has been sent to your email.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-2">Verify Your Account</h1>
        <p className="text-gray-600 mb-6">Enter the 6-digit code sent to your email.</p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            inputMode="numeric" // Shows numeric keyboard on mobile
            autoComplete="one-time-code" // Enables browser autofill for OTPs
            maxLength={6}
            pattern="\d{6}" // Validates only 6 digits
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Only allow numbers
            placeholder="0 0 0 0 0 0"
            className="w-full text-center text-3xl tracking-[0.5em] p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {message && (
            <p className={`text-sm ${status === "error" ? "text-red-500" : "text-green-600"}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading" || otp.length < 6}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {status === "loading" ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-500">
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={timer > 0}
            className="text-blue-600 font-medium disabled:text-gray-400 hover:underline"
          >
            {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
          </button>
        </div>

        <Link href="/signup" className="block mt-4 text-xs text-gray-400 hover:underline">
          Entered the wrong email? Back to Signup
        </Link>
      </div>
    </div>
  );
}

