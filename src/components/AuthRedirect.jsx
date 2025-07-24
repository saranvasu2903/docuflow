"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { get } from "@/utils/apiHelper";

export default function AuthRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const checkUserAndRedirect = async () => {
      const orgMemberships = user.organizationMemberships || [];
      const userid = user.id || "";

      // First check: if no organization → onboarding
      if (orgMemberships.length === 0) {
        router.replace("/onboarding");
        return;
      }

      const isAdmin = orgMemberships.some(
        (membership) => membership.role === "org:admin"
      );

      // Non-admin users go to dashboard
      if (!isAdmin) {
        router.replace("/settings");
        return;
      }

      // Admin with organization → check tierid
      try {
        const data = await get(`/users/${userid}`);
        const tierid = data?.tierid;

        if (!tierid) {
          router.replace("/subscription");
        } else {
          router.replace("/settings");
        }
      } catch (err) {
        console.error("Error fetching user data:", err.message);
        router.replace("/subscription");
      }
    };

    checkUserAndRedirect();
  }, [isLoaded, user, router]);

  return null;
}
