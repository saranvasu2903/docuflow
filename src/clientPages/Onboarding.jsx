"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useCreateOrganization } from "@/hooks/organization";
import { Formik, Form, Field } from "formik";
import { countriesList } from "@/utils/countriesCodeList";

const getPhoneLengthsByCode = (code) => {
  const country = countriesList.find((c) => c.phone.includes(code));
  return country?.phoneLength || [10];
};

const initialValues = {
  name: "",
  website: "",
  email: "",
  countryCode: "+91",
  phonenumber: "",
  workingfrom: "09:00",
  workingto: "17:00",
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
};

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const { createOrganization, isCreating } = useCreateOrganization();
  const [step, setStep] = useState(1);

  if (!isLoaded) return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const steps = [
    "Company Information",
    "Contact Details",
    "Address",
    "Social Media",
    "Review & Submit"
  ];

  const handleNext = () => {
    if (step < steps.length) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col">
      <div className="flex-grow flex w-full">
        {/* Left Side - Stepper (30%, Fixed) */}
        <div className="w-1/3 bg-gradient-to-b from-blue-600 to-blue-700 p-8 text-white flex flex-col">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Vendor Onboarding</h1>
            <p className="text-blue-100 mt-2">
              Complete your profile to start using the platform
            </p>
          </div>
          
          <div className="space-y-6">
            {steps.map((stepName, index) => (
              <div key={index} className="flex items-start">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1 ${
                  step > index + 1
                    ? "bg-green-400 text-white"
                    : step === index + 1
                    ? "bg-white text-blue-600"
                    : "bg-blue-500 bg-opacity-25 text-white"
                }`}>
                  {step > index + 1 ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <div>
                  <span className={`block text-sm font-medium ${
                    step >= index + 1 ? "text-white" : "text-blue-200"
                  }`}>
                    Step {index + 1}
                  </span>
                  <span className={`block font-medium ${
                    step >= index + 1 ? "text-white" : "text-blue-200"
                  }`}>
                    {stepName}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-auto pt-6 border-t border-blue-500 border-opacity-25">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-100">
                  Your information is secure and will not be shared.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form (70%, Scrollable) */}
        <div className="w-2/3 p-8 flex flex-col overflow-y-auto">
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
              const payload = {
                ...values,
                createdby: user.id,
                teamsize: Number(values.teamsize),
                booking_url: "",
              };
              createOrganization(payload);
            }}
          >
            {(form) => (
              <Form className="flex flex-col flex-grow">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-500">
                      Step {step} of {steps.length}
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      {Math.round((step / steps.length) * 100)}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${(step / steps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex-grow">
                  {step === 1 && (
                    <section className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-800">Company Information</h2>
                      <p className="text-gray-600">Tell us about your company</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vendor Name
                          </label>
                          <Field
                            name="name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="e.g. Acme Corp"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Website
                          </label>
                          <Field
                            name="website"
                            type="url"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="https://acme.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <Field
                            name="email"
                            type="email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="info@acme.com"
                          />
                        </div>
                      </div>
                    </section>
                  )}

                  {step === 2 && (
                    <section className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-800">Contact Details</h2>
                      <p className="text-gray-600">How can customers reach you?</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <div className="flex gap-3">
                            <Field
                              name="countryCode"
                              as="select"
                              className="w-1/3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            >
                              {countriesList.map((country, index) => (
                                <option
                                  key={`${country.phone[0]}-${index}`}
                                  value={country.phone[0]}
                                >
                                  {country.shortName} ({country.phone[0]})
                                </option>
                              ))}
                            </Field>
                            <Field
                              name="phonenumber"
                              type="tel"
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                              placeholder="Phone number"
                              maxLength={getPhoneLengthsByCode(form.values.countryCode)[0]}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Business Hours (From)
                          </label>
                          <Field
                            name="workingfrom"
                            type="time"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Business Hours (To)
                          </label>
                          <Field
                            name="workingto"
                            type="time"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Team Size
                          </label>
                          <Field
                            name="teamsize"
                            type="number"
                            min="0"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="10"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Logo URL
                          </label>
                          <Field
                            name="teamlogo"
                            type="url"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="https://logo.png"
                          />
                        </div>
                      </div>
                    </section>
                  )}

                  {step === 3 && (
                    <section className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-800">Address</h2>
                      <p className="text-gray-600">Where is your company located?</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Line 1
                          </label>
                          <Field
                            name="address"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="123 Street"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <Field
                            name="city"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State
                          </label>
                          <Field
                            name="state"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="State"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP Code
                          </label>
                          <Field
                            name="zip"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="ZIP Code"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                          </label>
                          <Field
                            name="country"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="Country"
                          />
                        </div>
                      </div>
                    </section>
                  )}

                  {step === 4 && (
                    <section className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-800">Social Media</h2>
                      <p className="text-gray-600">Connect your social profiles (optional)</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { platform: "facebook", name: "Facebook", icon: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" },
                          { platform: "instagram", name: "Instagram", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                          { platform: "linkedin", name: "LinkedIn", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                          { platform: "x", name: "X (Twitter)", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" }
                        ].map(({ platform, name, icon }) => (
                          <div key={platform}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {name}
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                                  <path fillRule="evenodd" d={icon} clipRule="evenodd" />
                                </svg>
                              </div>
                              <Field
                                name={platform}
                                type="url"
                                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder={`https://${platform}.com/username`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {step === 5 && (
                    <section className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-800">Review & Submit</h2>
                      <p className="text-gray-600">Please review your information before submitting</p>
                      
                      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                        <div>
                          <h3 className="font-medium text-gray-800 border-b pb-2 mb-3">Company Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Vendor Name</p>
                              <p className="font-medium">{form.values.name || <span className="text-gray-400">Not provided</span>}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Website</p>
                              <p className="font-medium">{form.values.website || <span className="text-gray-400">Not provided</span>}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium">{form.values.email || <span className="text-gray-400">Not provided</span>}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-gray-800 border-b pb-2 mb-3">Contact Details</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Phone Number</p>
                              <p className="font-medium">
                                {form.values.phonenumber ? `${form.values.countryCode} ${form.values.phonenumber}` : <span className="text-gray-400">Not provided</span>}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Business Hours</p>
                              <p className="font-medium">
                                {form.values.workingfrom && form.values.workingto ? `${form.values.workingfrom} to ${form.values.workingto}` : <span className="text-gray-400">Not provided</span>}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Team Size</p>
                              <p className="font-medium">{form.values.teamsize || "0"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Logo URL</p>
                              <p className="font-medium">{form.values.teamlogo || <span className="text-gray-400">Not provided</span>}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-gray-800 border-b pb-2 mb-3">Address</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <p className="text-sm text-gray-500">Address</p>
                              <p className="font-medium">{form.values.address || <span className="text-gray-400">Not provided</span>}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">City</p>
                              <p className="font-medium">{form.values.city || <span className="text-gray-400">Not provided</span>}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">State</p>
                              <p className="font-medium">{form.values.state || <span className="text-gray-400">Not provided</span>}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">ZIP Code</p>
                              <p className="font-medium">{form.values.zip || <span className="text-gray-400">Not provided</span>}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Country</p>
                              <p className="font-medium">{form.values.country || <span className="text-gray-400">Not provided</span>}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-gray-800 border-b pb-2 mb-3">Social Media</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Facebook</p>
                              <p className="font-medium">{form.values.facebook || <span className="text-gray-400">Not provided</span>}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Instagram</p>
                              <p className="font-medium">{form.values.instagram || <span className="text-gray-400">Not provided</span>}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">LinkedIn</p>
                              <p className="font-medium">{form.values.linkedin || <span className="text-gray-400">Not provided</span>}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">X (Twitter)</p>
                              <p className="font-medium">{form.values.x || <span className="text-gray-400">Not provided</span>}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Previous
                    </button>
                  )}
                  {step < steps.length ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="ml-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="ml-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Complete Onboarding"
                      )}
                    </button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;