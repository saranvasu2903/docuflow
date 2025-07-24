import { useAuth } from "@clerk/nextjs";
import { useDispatch } from "react-redux";
import { clearUserInfo } from "@/store/slices/userSlice";

export const useSignOut = () => {
  const { signOut } = useAuth();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await signOut();
      dispatch(clearUserInfo()); 
      window.location.href = "/sign-in";
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return handleSignOut;

};
