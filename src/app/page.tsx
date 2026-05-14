import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { redirect } from "next/navigation";
import AuthPage from "./AuthPage/page";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/landing");
  }

  return <AuthPage />;
}