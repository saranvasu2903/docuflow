"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { countriesList } from "@/utils/countriesCodeList";
import toast from "react-hot-toast";
import {
  useGetOrganization,
  useUpdateOrganization,
} from "@/hooks/organization";
import { useCreateTeamMember, useGetTeamMembers } from "@/hooks/teammembers";
import LoadingSpinner from "@/components/LoadingSpinner";

const getPhoneLengthsByCode = (code) => {
  const country = countriesList.find((c) => c.phone.includes(code));
  return country?.phoneLength || [15];
};

const schema = z
  .object({
    name: z.string().min(1, "Vendor Name is required"),
    website: z.string().url("Invalid website URL"),
    email: z.string().email("Invalid email"),
    countryCode: z.string().min(1, "Country code required"),
    phonenumber: z
      .string()
      .min(5, "Phone number too short")
      .max(15, "Phone number too long"),
    workingfrom: z.string().min(1, "Working From is required"),
    workingto: z.string().min(1, "Working To is required"),
    teamsize: z
      .number({ invalid_type_error: "Team Size must be a number" })
      .min(1, "Team Size must be at least 1"),
    teamlogo: z.string().url("Invalid logo URL"),
    facebook: z.string().url().optional().or(z.literal("")),
    instagram: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    x: z.string().url().optional().or(z.literal("")),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
    booking_url: z.string().url().optional().or(z.literal("")),
  })
  .superRefine(({ countryCode, phonenumber }, ctx) => {
    const phoneLengths = getPhoneLengthsByCode(countryCode);
    const maxLength = phoneLengths.length > 0 ? phoneLengths[0] : 15;
    if (phonenumber.length > maxLength) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: maxLength,
        type: "string",
        inclusive: true,
        message: `Phone number too long (max ${maxLength} digits for selected country)`,
        path: ["phonenumber"],
      });
    }
  });

const teamMemberSchema = z.object({
  fullname: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email"),
});

const initialValues = {
  name: "",
  website: "",
  email: "",
  countryCode: "+91",
  phonenumber: "",
  workingfrom: "",
  workingto: "",
  teamsize: 0,
  teamlogo: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  x: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  booking_url: "",
};

const initialTeamMemberValues = {
  fullname: "",
  email: "",
};

const getInputClass = (touched, error) =>
  `input input-bordered w-full ${
    touched && error ? "input-error" : ""
  } bg-base-100 text-base-content`;

const getInputField = (field, form, placeholder, type = "text") => {
  const touched = form.touched[field];
  const error = form.errors[field];
  return (
    <Field name={field}>
      {({ field }) => (
        <input
          {...field}
          type={type}
          placeholder={placeholder}
          className={getInputClass(touched, error)}
          onKeyPress={
            type === "number" || type === "tel"
              ? (e) => !/\d/.test(e.key) && e.preventDefault()
              : undefined
          }
        />
      )}
    </Field>
  );
};

const OrganizationSettings = () => {
  const { user, isLoaded } = useUser();
  const createdby = user?.id;

  const { organization, isLoading, isError } = useGetOrganization(createdby);
  const { updateOrganization, isUpdating } = useUpdateOrganization(createdby);
  const { createTeamMember, isCreating } = useCreateTeamMember();
  const {
    teamMembers,
    isLoading: isTeamMembersLoading,
    isError: isTeamMembersError,
  } = useGetTeamMembers(organization?.id);

  const [formInitialValues, setFormInitialValues] = useState(initialValues);

  useEffect(() => {
    if (organization) {
      setFormInitialValues({
        name: organization.name || "",
        website: organization.website || "",
        email: organization.email || "",
        countryCode: organization.countryCode || "+91",
        phonenumber: organization.phonenumber || "",
        workingfrom: organization.workingfrom || "",
        workingto: organization.workingto || "",
        teamsize: organization.teamsize || 0,
        teamlogo: organization.teamlogo || "",
        facebook: organization.facebook || "",
        instagram: organization.instagram || "",
        linkedin: organization.linkedin || "",
        x: organization.x || "",
        address: organization.address || "",
        city: organization.city || "",
        state: organization.state || "",
        zip: organization.zip || "",
        country: organization.country || "",
        booking_url: organization.booking_url || "",
      });
    }
  }, [organization]);

  if (!isLoaded || isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <div className="text-error text-center">Error loading vendor data.</div>
    );

  return (
    <div className="">
      <div className="mb-6 mx-auto">
        <h1 className="text-2xl font-bold">Vendor Settings</h1>
        <p className="opacity-75 mt-1">
          Manage your vendor details and team members
        </p>
      </div>
      <div className="relative mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card col-span-2 bg-base-100 shadow-xl">
            <div className="card-body">
              <Formik
                enableReinitialize
                initialValues={formInitialValues}
                validationSchema={toFormikValidationSchema(schema)}
                onSubmit={(values) => {
                  if (!createdby) {
                    toast.error("User not authenticated");
                    return;
                  }
                  const { countryCode, ...rest } = values;
                  const payload = {
                    ...rest,
                    teamsize: Number(values.teamsize),
                    createdby,
                  };
                  updateOrganization(payload);
                }}
              >
                {(form) => (
                  <Form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">
                          <span className="label-text text-base-content">
                            Vendor Name
                            <span className="text-error">*</span>
                          </span>
                        </label>
                        {getInputField("name", form, "e.g. Acme Corp")}
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-error text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text text-base-content">
                            Website<span className="text-error">*</span>
                          </span>
                        </label>
                        {getInputField(
                          "website",
                          form,
                          "https://acme.com",
                          "url"
                        )}
                        <ErrorMessage
                          name="website"
                          component="div"
                          className="text-error text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text text-base-content">
                            Email<span className="text-error">*</span>
                          </span>
                        </label>
                        {getInputField("email", form, "info@acme.com", "email")}
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-error text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text text-base-content">
                            Phone Number<span className="text-error">*</span>
                          </span>
                        </label>
                        <div className="flex items-center gap-2">
                          <Field name="countryCode">
                            {({ field }) => (
                              <select
                                {...field}
                                className="select select-bordered w-30 bg-base-100 text-base-content"
                                onChange={(e) =>
                                  form.setFieldValue(
                                    "countryCode",
                                    e.target.value
                                  )
                                }
                              >
                                <option disabled value="">
                                  Country
                                </option>
                                {countriesList.map((country, index) => (
                                  <option
                                    key={`${country.phone[0]}-${index}`}
                                    value={country.phone[0]}
                                  >
                                    {country.shortName} ({country.phone[0]})
                                  </option>
                                ))}
                              </select>
                            )}
                          </Field>
                          <Field name="phonenumber">
                            {({ field }) => {
                              const isError =
                                form.touched.phonenumber &&
                                form.errors.phonenumber;
                              const phoneLength = getPhoneLengthsByCode(
                                form.values.countryCode
                              )[0];
                              return (
                                <input
                                  {...field}
                                  type="tel"
                                  placeholder={`Max ${phoneLength} digits`}
                                  maxLength={phoneLength}
                                  className={getInputClass(
                                    form.touched.phonenumber,
                                    isError
                                  )}
                                />
                              );
                            }}
                          </Field>
                        </div>
                        <ErrorMessage
                          name="countryCode"
                          component="div"
                          className="text-error text-sm mt-1"
                        />
                        <ErrorMessage
                          name="phonenumber"
                          component="div"
                          className="text-error text-sm mt-1"
                        />  
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text text-base-content">
                            Working From<span className="text-error">*</span>
                          </span>
                        </label>
                        <Field name="workingfrom">
                          {({ field }) => (
                            <input
                              {...field}
                              type="time"
                              className={getInputClass(
                                form.touched.workingfrom,
                                form.errors.workingfrom
                              )}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="workingfrom"
                          component="div"
                          className="text-error text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text text-base-content">
                            Working To<span className="text-error">*</span>
                          </span>
                        </label>
                        <Field name="workingto">
                          {({ field }) => (
                            <input
                              {...field}
                              type="time"
                              className={getInputClass(
                                form.touched.workingto,
                                form.errors.workingto
                              )}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="workingto"
                          component="div"
                          className="text-error text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text text-base-content">
                            Team Size<span className="text-error">*</span>
                          </span>
                        </label>
                        {getInputField("teamsize", form, "10", "number")}
                        <ErrorMessage
                          name="teamsize"
                          component="div"
                          className="text-error text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text text-base-content">
                            Logo URL<span className="text-error">*</span>
                          </span>
                        </label>
                        {getInputField(
                          "teamlogo",
                          form,
                          "https://logo.png",
                          "url"
                        )}
                        <ErrorMessage
                          name="teamlogo"
                          component="div"
                          className="text-error text-sm mt-1"
                        />
                        {form.values.teamlogo && (
                          <img
                            src={form.values.teamlogo}
                            alt="Organization Logo"
                            className="h-12 mt-2 object-contain"
                          />
                        )}
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-base-300">
                      <h3 className="text-md font-semibold text-base-content mb-4">
                        Social Media
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["facebook", "instagram", "linkedin", "x"].map(
                          (platform) => (
                            <div key={platform}>
                              <label className="label">
                                <span className="label-text text-base-content">
                                  {platform.charAt(0).toUpperCase() +
                                    platform.slice(1)}
                                </span>
                              </label>
                              {getInputField(
                                platform,
                                form,
                                `https://${platform}.com`,
                                "url"
                              )}
                              <ErrorMessage
                                name={platform}
                                component="div"
                                className="text-error text-sm mt-1"
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-base-300">
                      <h3 className="text-md font-semibold text-base-content mb-4">
                        Address
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            label: "Address Line 1",
                            name: "address",
                            placeholder: "123 Street",
                          },
                          { label: "City", name: "city", placeholder: "City" },
                          {
                            label: "State",
                            name: "state",
                            placeholder: "State",
                          },
                          {
                            label: "ZIP",
                            name: "zip",
                            placeholder: "ZIP Code",
                          },
                          {
                            label: "Country",
                            name: "country",
                            placeholder: "Country",
                          },
                        ].map(({ label, name, placeholder }) => (
                          <div key={name}>
                            <label className="label">
                              <span className="label-text text-base-content">
                                {label}
                              </span>
                            </label>
                            {getInputField(name, form, placeholder)}
                            <ErrorMessage
                              name={name}
                              component="div"
                              className="text-error text-sm mt-1"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        type="submit"
                        className="btn btn-primary rounded-full"
                        disabled={isUpdating || form.isSubmitting}
                      >
                        {isUpdating || form.isSubmitting
                          ? "Saving..."
                          : "Save Changes"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="text-lg font-semibold text-base-content mb-4">
                Add Members
              </h2>
              <Formik
                initialValues={initialTeamMemberValues}
                validationSchema={toFormikValidationSchema(teamMemberSchema)}
                onSubmit={(values, { resetForm }) => {
                  if (!createdby) {
                    toast.error("User not authenticated");
                    return;
                  }
                  if (!organization?.id) {
                    toast.error("Organization data not loaded");
                    return;
                  }
                  const teamMemberPayload = {
                    parentid: createdby,
                    fullname: values.fullname,
                    email: values.email,
                    organizationid: organization.id,
                    Org_ID: organization.Org_ID,
                  };
                  createTeamMember(teamMemberPayload);
                  resetForm();
                }}
              >
                {(form) => (
                  <Form>
                    <div className="space-y-4">
                      <div>
                        <label className="label">
                          <span className="label-text text-base-content">
                            Full Name<span className="text-error">*</span>
                          </span>
                        </label>
                        {getInputField("fullname", form, "Enter full name")}
                        <ErrorMessage
                          name="fullname"
                          component="div"
                          className="text-error text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text text-base-content">
                            Email<span className="text-error">*</span>
                          </span>
                        </label>
                        {getInputField("email", form, "Enter email", "email")}
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-error text-sm mt-1"
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary rounded-full"
                        disabled={isCreating || form.isSubmitting}
                      >
                        {isCreating || form.isSubmitting
                          ? "Adding..."
                          : "Add Member"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
              <div className="mt-6">
                <h3 className="text-md font-semibold text-base-content mb-2">
                  Members
                </h3>
                {isTeamMembersLoading ? (
                  <LoadingSpinner />
                ) : isTeamMembersError ||
                  !teamMembers ||
                  teamMembers.length === 0 ? (
                  <p className="text-base-content/60">No members available.</p>
                ) : (
                  <div className="max-h-64 overflow-y-auto pr-2">
                    <ul className="space-y-4">
                      {teamMembers.map((member) => (
                        <li
                          key={member.id}
                          className="border-b border-base-300 pb-2"
                        >
                          <div className="flex justify-between">
                            <div>
                              <p className="text-sm font-medium text-base-content">
                                {member.fullname}
                              </p>
                              <p className="text-sm text-base-content/60">
                                {member.email}
                              </p>
                            </div>
                            <p
                              className={`text-sm capitalize ${
                                member.status === "pending"
                                  ? "text-warning"
                                  : "text-success"
                              }`}
                            >
                              {member.status}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSettings;
