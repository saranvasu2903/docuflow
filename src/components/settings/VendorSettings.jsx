"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useGetOrganization, useUpdateOrganization } from "@/hooks/organization";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Input } from "@/components/ui/input";

const SectionHeader = ({ title }) => (
  <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">{title}</h3>
);

const FormField = ({ label, children, className = "" }) => (
  <div className={`mb-5 ${className}`}>
    <label className="block text-sm font-medium text-gray-600 mb-2">
      {label}
    </label>
    {children}
  </div>
);

const BasicInfoFields = ({ formValues, handleChange }) => (
  <div className="mb-10">
    <SectionHeader title="Organization Profile" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <FormField label="Organization Name *">
        <Input
          name="name"
          value={formValues.name}
          onChange={handleChange}
          placeholder="Acme Corporation"
          className="w-full bg-gray-50 border-gray-200 focus:ring-2 focus:ring-purple-500"
        />
      </FormField>

      <FormField label="Website *">
        <Input
          name="website"
          type="url"
          value={formValues.website}
          onChange={handleChange}
          placeholder="https://acme.com"
          className="w-full bg-gray-50 border-gray-200 focus:ring-2 focus:ring-purple-500"
        />
      </FormField>

      <FormField label="Contact Email *">
        <Input
          name="email"
          type="email"
          value={formValues.email}
          onChange={handleChange}
          placeholder="contact@acme.com"
          className="w-full bg-gray-50 border-gray-200 focus:ring-2 focus:ring-purple-500"
        />
      </FormField>

      <FormField label="Phone Number *">
        <div className="flex gap-3">
          <Input
            name="countryCode"
            value={formValues.countryCode}
            onChange={handleChange}
            placeholder="+1"
            className="w-1/4 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-purple-500"
          />
          <Input
            name="phonenumber"
            value={formValues.phonenumber}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            className="w-3/4 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Opens At *">
          <Input
            name="workingfrom"
            type="time"
            value={formValues.workingfrom}
            onChange={handleChange}
            className="w-full bg-gray-50 border-gray-200 focus:ring-2 focus:ring-purple-500"
          />
        </FormField>

        <FormField label="Closes At *">
          <Input
            name="workingto"
            type="time"
            value={formValues.workingto}
            onChange={handleChange}
            className="w-full bg-gray-50 border-gray-200 focus:ring-2 focus:ring-purple-500"
          />
        </FormField>
      </div>

      <FormField label="Team Size *">
        <Input
          name="teamsize"
          type="number"
          value={formValues.teamsize}
          onChange={handleChange}
          placeholder="25"
          min="1"
          className="w-full bg-gray-50 border-gray-200 focus:ring-2 focus:ring-purple-500"
        />
      </FormField>

      <FormField label="Organization Logo *">
        <Input
          name="teamlogo"
          type="url"
          value={formValues.teamlogo}
          onChange={handleChange}
          placeholder="https://logo.png"
          className="w-full bg-gray-50 border-gray-200 focus:ring-2 focus:ring-purple-500"
        />
        {formValues.teamlogo && (
          <div className="mt-3 p-2 border border-gray-200 rounded-lg inline-block">
            <img
              src={formValues.teamlogo}
              alt="Organization Logo"
              className="h-16 object-contain"
            />
          </div>
        )}
      </FormField>
    </div>
  </div>
);

const SocialMediaFields = ({ formValues, handleChange }) => (
  <div className="mt-10 pt-6 border-t border-gray-100">
    <SectionHeader title="Social Media Profiles" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { platform: "facebook", icon: "👍" },
        { platform: "instagram", icon: "📷" }, 
        { platform: "linkedin", icon: "💼" },
        { platform: "x", icon: "𝕏" }
      ].map(({ platform, icon }) => (
        <FormField
          key={platform}
          label={
            <span className="flex items-center gap-2">
              <span>{icon}</span>
              <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
            </span>
          }
        >
          <Input
            name={platform}
            type="url"
            value={formValues[platform]}
            onChange={handleChange}
            placeholder={`https://${platform}.com/yourpage`}
            className="w-full bg-gray-50 border-gray-200 focus:ring-2 focus:ring-purple-500"
          />
        </FormField>
      ))}
    </div>
  </div>
);

const VendorSettings = () => {
  const { user, isLoaded } = useUser();
  const userId = user?.id;
  const createdby = user?.id;
  const { organization, isLoading, isError } = useGetOrganization(userId);
  const { updateOrganization, isUpdating } = useUpdateOrganization(createdby);
  const [formValues, setFormValues] = useState({
    name: "",
    website: "",
    email: "",
    countryCode: "+1",
    phonenumber: "",
    workingfrom: "",
    workingto: "",
    teamsize: "",
    teamlogo: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    x: "",
  });

  useEffect(() => {
    if (organization) {
      setFormValues({
        name: organization.name || "",
        website: organization.website || "",
        email: organization.email || "",
        countryCode: organization.phonenumber?.startsWith("+")
          ? organization.phonenumber.slice(0, organization.phonenumber.length - 10)
          : "+1",
        phonenumber: organization.phonenumber?.startsWith("+")
          ? organization.phonenumber.slice(-10)
          : organization.phonenumber || "",
        workingfrom: organization.workingfrom || "",
        workingto: organization.workingto || "",
        teamsize: organization.teamsize || "",
        teamlogo: organization.teamlogo || "",
        facebook: organization.facebook || "",
        instagram: organization.instagram || "",
        linkedin: organization.linkedin || "",
        x: organization.x || "",
      });
    }
  }, [organization]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!createdby) {
      toast.error("Please authenticate to save changes");
      return;
    }
    const { countryCode, phonenumber, ...rest } = formValues;
    const payload = {
      ...rest,
      phonenumber: countryCode && phonenumber ? `${countryCode}${phonenumber}` : phonenumber || "",
      teamsize: formValues.teamsize ? Number(formValues.teamsize) : 0,
      createdby,
    };
    updateOrganization(payload);
    toast.success("Organization settings updated!");
  };

  if (!isLoaded || isLoading) return <LoadingSpinner fullPage />;
  if (isError) return <div className="text-red-500 text-center py-10">Failed to load organization data</div>;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Organization Settings</h2>
          <p className="text-gray-500 mt-1">Manage your company profile and visibility</p>
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg disabled:opacity-70"
          disabled={isUpdating}
        >
          {isUpdating ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
      
      <BasicInfoFields formValues={formValues} handleChange={handleChange} />
      <SocialMediaFields formValues={formValues} handleChange={handleChange} />
    </form>
  );
};

export default VendorSettings;