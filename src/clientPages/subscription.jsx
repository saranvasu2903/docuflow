"use client";

import { Check } from "lucide-react";
import { useSelector } from "react-redux";
import { useTierCreation, useGetAllTier } from "@/hooks/tier";
import toast from "react-hot-toast";

export default function SubscriptionPage() {
  const userId = useSelector((state) => state.user.userId);
  const orgId = useSelector((state) => state.user.organizationId);
  const { selectTier, isCreating, isError: createError } = useTierCreation();
  const { getalltier, isLoading, isError: fetchError } = useGetAllTier();

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <p className="text-lg text-gray-600">Loading plans...</p>
      </div>
    );
  }

  if (fetchError || !getalltier?.tiers) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <p className="text-lg text-red-600">Failed to load plans. Please try again.</p>
      </div>
    );
  }

  const handleSelectTier = (tierId, durationmonths) => {
    if (!userId || !orgId) {
      toast.error("Please sign in and create an organization first.");
      return;
    }
    selectTier({
      org_id: orgId,
      tier_id: tierId,
      durationmonth: durationmonths,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            Select Your Enterprise Plan
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock powerful features tailored for your business. Choose a plan that scales with your needs.
          </p>
          <div className="mt-6 text-sm text-gray-500 bg-gray-100 py-3 px-4 rounded-lg inline-block">
            <p><strong>User ID:</strong> {userId || "Not signed in"}</p>
            <p><strong>Org ID:</strong> {orgId || "No organization created"}</p>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {getalltier.tiers.map((plan, idx) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.name === "3 Month Plan" ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200"
              }`}
            >
              {/* Popular Badge */}
              {plan.name === "3 Month Plan" && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-md">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Details */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>
              <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-extrabold text-gray-900">${parseFloat(plan.price).toFixed(2)}</span>
                <span className="text-base font-medium text-gray-500 ml-1">
                  {plan.durationmonths === 0
                    ? "1 Week"
                    : plan.durationmonths === 1
                    ? "/month"
                    : plan.durationmonths === 3
                    ? "/3 months"
                    : "/year"}
                </span>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{plan.teamlimit} Team Members</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{plan.taskupload} Task Uploads</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">
                    {plan.description.split("with ")[1] || "Standard Access"}
                  </span>
                </li>
              </ul>

              {/* Action Button */}
              <button
                onClick={() => handleSelectTier(plan.id, plan.durationmonths)}
                disabled={isCreating}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-colors duration-200 ${
                  plan.isfree
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } ${isCreating ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isCreating ? "Processing..." : plan.isfree ? "Start Trial" : "Subscribe"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}