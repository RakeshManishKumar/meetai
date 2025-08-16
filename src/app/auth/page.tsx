


import { Card } from '@/components/ui/card'
import { auth } from '@/lib/auth';

import { SignUpView } from '@/modules/auth/ui/views/sign-up-view'
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
const page = async () => {
  
    const session = await auth.api.getSession(
        {
             headers:await headers()
        }
      )
      if(!!session)
      {
        redirect("/");
      }
  return (
    <SignUpView/>
  )
}

export default page


// interface props {
//     children: React.ReactNode
// }
// const Layout = ({children}: props) => {
//   return (
//     <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
//       <div className="w-full max-w-sm md:max-w-3xl">
//      {children}
//       </div>
//     </div>
//   )
// }

// export default Layout
