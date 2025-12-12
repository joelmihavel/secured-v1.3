"use client";

import { useState } from "react";
import { submitHubSpotForm } from "@/lib/hubspot";
import { Button } from "./Button";
import { useGooglePlacesAutocomplete } from "@/hooks/useGooglePlacesAutocomplete";

const portalId = "45469632";
const formId = "2ef75bf3-54a2-465a-815b-2d03e784a66e";

// Add your Google Maps API key here
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export const GetStartedForm = ({ buttonText = "Let's Get Started" }: { buttonText?: string }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    phone: "",
    email: "",
    propertyAddress: "",
    typeOfHome: "",
    "Expected-Rent": "",
    isVacant: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle place selection from autocomplete
  const handlePlaceSelected = (place: { formatted_address?: string }) => {
    if (place.formatted_address) {
      setFormData((prev) => ({
        ...prev,
        propertyAddress: place.formatted_address || "",
      }));
    }
  };

  // Initialize Google Places Autocomplete
  const autocompleteRef = useGooglePlacesAutocomplete({
    apiKey: GOOGLE_MAPS_API_KEY,
    onPlaceSelected: handlePlaceSelected,
    options: {
      types: ["geocode", "establishment"],
      componentRestrictions: { country: "in" },
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await submitHubSpotForm(portalId, formId, formData, {
        pageUri: window.location.href,
        pageName: document.title,
      });

      setStatus("success");
      setFormData({
        firstname: "",
        phone: "",
        email: "",
        propertyAddress: "",
        typeOfHome: "",
        "Expected-Rent": "",
        isVacant: "",
      });
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  };

  if (status === "success") {
    return (
      <div className="bg-pastel-green/20 border border-pastel-green rounded-lg p-8 text-center">
        <h3 className="text-2xl font-heading text-text-main mb-4">
          Thank You! 🎉
        </h3>
        <p className="text-body font-body text-gray-600 mb-6">
          We&apos;ve received your information and will get back to you shortly.
        </p>
        <Button onClick={() => setStatus("idle")}>Submit Another</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="firstname"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="firstname"
          name="firstname"
          required
          value={formData.firstname}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-text-main focus:border-transparent"
          placeholder="Your Name"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Your Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-text-main focus:border-transparent"
          placeholder="Your Phone Number"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-text-main focus:border-transparent"
          placeholder="your.email@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="propertyAddress"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Property Address
        </label>
        <input
          ref={autocompleteRef}
          type="text"
          id="propertyAddress"
          name="propertyAddress"
          value={formData.propertyAddress}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-text-main focus:border-transparent"
          placeholder="Start typing your property address"
        />
      </div>

      <div>
        <label
          htmlFor="typeOfHome"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Type of Home
        </label>
        <select
          id="typeOfHome"
          name="typeOfHome"
          value={formData.typeOfHome}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-text-main focus:border-transparent"
        >
          <option value="">Select type of home</option>
          <option value="Independent Home">Independent Home</option>
          <option value="Gated Society">Gated Society</option>
          <option value="Independent Building">Independent Building</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="Expected-Rent"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Expected Rent
        </label>
        <input
          type="text"
          id="Expected-Rent"
          name="Expected-Rent"
          value={formData["Expected-Rent"]}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-text-main focus:border-transparent"
          placeholder="Expected Rent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Is your property vacant right now?
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="isVacant"
              value="Yes"
              checked={formData.isVacant === "Yes"}
              onChange={handleChange}
              className="mr-2"
            />
            <span>Yes</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="isVacant"
              value="No"
              checked={formData.isVacant === "No"}
              onChange={handleChange}
              className="mr-2"
            />
            <span>No</span>
          </label>
        </div>
      </div>

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{errorMessage}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={status === "loading"}
        className="w-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        size="lg"
      >
        {status === "loading" ? "Submitting..." : buttonText}
      </Button>
    </form>
  );
};
