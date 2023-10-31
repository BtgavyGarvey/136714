import { redirect } from "next/navigation";
import VerifyEmailPage from "../../../../components/sc/verifyemail/page";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export default async function VerifyEmail(){

  return(
    <>
      <VerifyEmailPage />

    </>
  )
}