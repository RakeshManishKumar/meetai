import { HomeView } from "@/modules/home/ui/views/home-view"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import {auth} from "@/lib/auth"

const page = async () => {

  
  const session = await auth.api.getSession(
    {
         headers:await headers()
    }
  )
  if(!session)
  {
    redirect("/auth/sign-in");
  }
  return (
   <HomeView/>
  )
}

export default page
