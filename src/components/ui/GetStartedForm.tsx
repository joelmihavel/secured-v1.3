"use client";

import { useState } from "react";
import { submitHubSpotForm } from "@/lib/hubspot";
import { Button } from "./Button";
import { useGooglePlacesAutocomplete } from "@/hooks/useGooglePlacesAutocomplete";
import { useCTATracking } from "@/hooks/useCTATracking";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

const portalId = "45469632";
const formId = "2ef75bf3-54a2-465a-815b-2d03e784a66e";

// Add your Google Maps API key here
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export const GetStartedForm = ({ buttonText = "Let's Get Started" }: { buttonText?: string }) => {
  const { trackCTAClick } = useCTATracking();
  const [formData, setFormData] = useState({
    firstname: "",
    phone: "",
    email: "",
    landlord_lead_property_address: "",
    typeofhome: "",
    expected_rent: "",
    is_property_vacant_now: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [addressSelectedFromDropdown, setAddressSelectedFromDropdown] = useState(false);

  // Handle place selection from autocomplete
  const handlePlaceSelected = (place: { formatted_address?: string }) => {
    if (place.formatted_address) {
      setFormData((prev) => ({
        ...prev,
        landlord_lead_property_address: place.formatted_address || "",
      }));
      setAddressSelectedFromDropdown(true);
    }
  };

  // Handle address input change - reset dropdown selection flag if user manually edits
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      landlord_lead_property_address: e.target.value,
    }));
    setAddressSelectedFromDropdown(false);
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

    // Validate required fields
    if (!formData.landlord_lead_property_address) {
      setStatus("error");
      setErrorMessage("Please enter your property address.");
      return;
    }

    if (!addressSelectedFromDropdown) {
      setStatus("error");
      setErrorMessage("Please select your property address from the dropdown suggestions.");
      return;
    }

    if (!formData.phone) {
      setStatus("error");
      setErrorMessage("Please enter your phone number.");
      return;
    }

    if (!isValidPhoneNumber(formData.phone)) {
      setStatus("error");
      setErrorMessage("Please enter a valid phone number.");
      return;
    }

    if (!formData.typeofhome) {
      setStatus("error");
      setErrorMessage("Please select the type of home.");
      return;
    }

    if (!formData.is_property_vacant_now) {
      setStatus("error");
      setErrorMessage("Please indicate if your property is vacant right now.");
      return;
    }

    // Track form submission
    trackCTAClick({
      cta_id: "form_get_started_submit",
      cta_text: buttonText,
      cta_type: "form_submit",
      page_section: "owners_contact_form",
    }, {
      form_type: "owners_get_started",
      has_property_address: !!formData.landlord_lead_property_address,
      has_expected_rent: !!formData.expected_rent,
    });

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
        landlord_lead_property_address: "",
        typeofhome: "",
        expected_rent: "",
        is_property_vacant_now: "",
      });
      setAddressSelectedFromDropdown(false);
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
        <PhoneInput
          international
          defaultCountry="IN"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, phone: value || "" }))
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-text-main focus:border-transparent [&_.PhoneInputInput]:border-none [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:w-full"
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
          htmlFor="landlord_lead_property_address"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Property Address <span className="text-red-500">*</span>
        </label>
        <input
          ref={autocompleteRef}
          type="text"
          id="landlord_lead_property_address"
          name="landlord_lead_property_address"
          required
          value={formData.landlord_lead_property_address}
          onChange={handleAddressChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-text-main focus:border-transparent"
          placeholder="Start typing your property address"
        />
      </div>

      <div>
        <label
          htmlFor="typeofhome"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Type of Home <span className="text-red-500">*</span>
        </label>
        <select
          id="typeofhome"
          name="typeofhome"
          value={formData.typeofhome}
          onChange={handleChange}
          required
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
          htmlFor="expected_rent"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Expected Rent
        </label>
        <input
          type="text"
          id="expected_rent"
          name="expected_rent"
          value={formData.expected_rent}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-text-main focus:border-transparent"
          placeholder="Expected Rent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Is your property vacant right now? <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="is_property_vacant_now"
              value="Yes"
              checked={formData.is_property_vacant_now === "Yes"}
              onChange={handleChange}
              required
              className="mr-2"
            />
            <span>Yes</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="is_property_vacant_now"
              value="No"
              checked={formData.is_property_vacant_now === "No"}
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
        data-cta-id="form_get_started_button"
        data-cta-context="owners_contact_form"
      >
        {status === "loading" ? "Submitting..." : buttonText}
      </Button>
    </form>
  );
};
