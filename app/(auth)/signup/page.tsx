"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "", // Only needed for client-side check
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password 
        }),
      });

      if (res.ok) {
        router.push("/verify"); // Send them to a "Check your email" page
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError("Something went wrong.");
    }
  };

  return (
    <main>
      <div>
        <h1>Sign Up</h1>
        {error && <p style={{color: 'red'}}>{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input 
            type="email" 
            required 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />

          <label>Password</label>
          <input 
            type="password" 
            required 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />

          <label>Confirm Password</label>
          <input 
            type="password" 
            required 
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
          />

          <button type="submit">Sign up</button>
          <Link href="/signin">Already have an account?</Link>
        </form>
      </div>
    </main>
  );
};

export default Page;
