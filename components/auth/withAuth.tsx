import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkSession } from "@/sessions/sessions";

const withAuth = (Component: React.FC) => {
  return function AuthGuard(props: any) {
    const Router = useRouter();

    useEffect(() => {
        const initializeAuth = async () => {
            const session = await checkSession();
            if(!session){
                Router.replace('/login')
            }
        };
        initializeAuth();
      }, []);
    return  <Component {...props} />;
  };
};
  
export default withAuth;
