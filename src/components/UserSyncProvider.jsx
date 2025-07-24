"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { get, post } from "@/utils/apiHelper";
import { useDispatch } from "react-redux";
import { setUserInfo, clearUserInfo } from "@/store/slices/userSlice";

export default function UserSyncProvider({ children }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const prevRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && user && prevRef.current !== user.id) {
      prevRef.current = user.id;
      (async () => {
        try {
          const data = await get(`/users/${user.id}`);
          console.log("data",data)
          dispatch(
            setUserInfo({
              userId: data.id,
              organizationId: data.Org_ID,
              email: data.email,
              fullName: data.fulldata?.fullName ?? data.fullname,
              role: data.role,
              imageUrl: data.fulldata?.imageUrl,
              tierid: data.tierid
            })
          );
        } catch {
          try {
            const created = await post("/clerk/syncuser", { user });

            dispatch(
              setUserInfo({
                userId: created.id,
                organizationId: created.Org_ID,
                email: created.email,
                fullName: created.fulldata?.fullName,
                role: created.role,
                imageUrl: created.fulldata?.imageUrl,
                tierid: created.tierid
              })
            );
          } catch (err) {
            console.error("Syncuser API error:", err);
          }
        }
      })();

    } else if (!isSignedIn) {
      dispatch(clearUserInfo());
      prevRef.current = null;
    }
  }, [isLoaded, isSignedIn, user?.id, dispatch]);

  return <>{children}</>;
}
