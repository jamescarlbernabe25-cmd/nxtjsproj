import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HomeLogin from "./home-login/Homelogin";
import HomeNotLogin from "./home-notlogin/Homenotlogin";
import Navbar from "@/components/Navbar";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <main>
      <Navbar /> 
      {session ? <HomeLogin /> : <HomeNotLogin />}
    </main>
  );
}
