"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { get, post } from "@/utils/apiHelper";
import { useDispatch } from "react-redux";
import { setUserInfo, clearUserInfo } from "@/store/slices/userSlice";
import { useGetRoleDetails } from "@/hooks/role";

export default function UserSyncProvider({ children }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const prevRef = useRef(null);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null); 
  const [roleId, setRoleId] = useState(null);

  const { data: roleDetails } = useGetRoleDetails(roleId);

  useEffect(() => {
    if (roleDetails && userData) {
      dispatch(
        setUserInfo({
          ...userData,
          permission: roleDetails.data.permissions ?? [],
        })
      );
    }
  }, [roleDetails, userData, dispatch]);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user && prevRef.current !== user.id) {
      prevRef.current = user.id;

      (async () => {
        try {
          const data = await get(`/users/${user.id}`);

          if (data?.role) setRoleId(data.role);

          const baseUserData = {
            userId: data.id,
            organizationId: data.Org_ID,
            email: data.email,
            fullName: data.fulldata?.fullName ?? data.fullname,
            role: data.role,
            imageUrl: data.fulldata?.imageUrl,
            tierid: data.tierid,
          };

          setUserData(baseUserData);

          dispatch(
            setUserInfo({
              ...baseUserData,
              permission: [],
            })
          );
        } catch {
          try {
            const created = await post("/clerk/syncuser", { user });
            if (created?.role) setRoleId(created.role);
            const baseUserData = {
              userId: created.id,
              organizationId: created.Org_ID,
              email: created.email,
              fullName: created.fulldata?.fullName,
              role: created.role,
              imageUrl: created.fulldata?.imageUrl,
              tierid: created.tierid,
            };

            setUserData(baseUserData);

            dispatch(
              setUserInfo({
                ...baseUserData,
                permission: [],
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
      setRoleId(null);
      setUserData(null);
    }
  }, [isLoaded, isSignedIn, user?.id, dispatch]);

  return <>{children}</>;
}
