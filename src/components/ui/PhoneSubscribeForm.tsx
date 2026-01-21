"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";

export interface PhoneSubscribeFormProps {
  notificationType: "specific room" | "specific home" | "all homes" | "upcoming home";
  propertyId?: string;
  propertyName?: string;
  roomId?: string;
  placeholder?: string;
  buttonText?: string;
  className?: string;
  useEmail?: boolean; // If true, use email field; if false (default), use phone field
}

interface PhoneFormData {
  phone: string;
  name: string;
}

interface EmailFormData {
  email: string;
}

export const PhoneSubscribeForm = ({
  notificationType,
  propertyId,
  propertyName,
  roomId,
  placeholder,
  buttonText = "Subscribe",
  className = "",
  useEmail = false,
}: PhoneSubscribeFormProps) => {
  const defaultPlaceholder = useEmail 
    ? "Enter your email address" 
    : "+91 | Enter your phone number";
  
  const phoneForm = useForm<PhoneFormData>();
  const emailForm = useForm<EmailFormData>();
  
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handlePhoneSubmit = async (data: PhoneFormData) => {
    try {
      setSubmitStatus("idle");
      const requestBody = {
        phone: data.phone,
        name: data.name,
        notification_type: notificationType,
        property_id: propertyId,
        property_name: propertyName,
        room_id: roomId,
      };
      
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setSubmitStatus("success");
      phoneForm.reset();
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
  };

  const handleEmailSubmit = async (data: EmailFormData) => {
    try {
      setSubmitStatus("idle");
      const requestBody = {
        email: data.email,
        notification_type: notificationType,
        property_id: propertyId,
        property_name: propertyName,
        room_id: roomId,
      };
      
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setSubmitStatus("success");
      emailForm.reset();
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
  };

  if (useEmail) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = emailForm;
    
    return (
      <form
        onSubmit={handleSubmit(handleEmailSubmit)}
        className={`max-w-md mx-auto mb-4 ${className}`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="email"
            placeholder={placeholder || defaultPlaceholder}
            {...register("email", {
              required: "Email address is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            })}
            className="flex-1 px-6 py-3 rounded-l-[1rem] border border-white/20 focus:outline-none focus:ring-2 focus:ring-white bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60"
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            size="md"
            variant="primary"
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? "Subscribing..." : buttonText}
          </Button>
        </div>
        {errors.email && (
          <p className="text-red-300 text-sm mt-2 text-center">
            {errors.email.message}
          </p>
        )}
        {submitStatus === "success" && (
          <p className="text-green-300 text-sm mt-2 text-center">
            Successfully subscribed! We&apos;ll notify you about new homes.
          </p>
        )}
        {submitStatus === "error" && (
          <p className="text-red-300 text-sm mt-2 text-center">
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    );
  }

  const { register, handleSubmit, formState: { errors, isSubmitting } } = phoneForm;
  
  return (
    <form
      onSubmit={handleSubmit(handlePhoneSubmit)}
      className={`max-w-md mx-auto mb-4 ${className}`}
    >
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter your name"
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          })}
          className="flex-1 px-6 py-3 rounded-[1rem] border border-white/20 focus:outline-none focus:ring-2 focus:ring-white bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60"
          disabled={isSubmitting}
        />
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="tel"
            placeholder={placeholder || defaultPlaceholder}
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9+\-\s()]+$/,
                message: "Please enter a valid phone number",
              },
            })}
            className="flex-1 px-6 py-3 rounded-l-[1rem] border border-white/20 focus:outline-none focus:ring-2 focus:ring-white bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60"
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            size="md"
            variant="primary"
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? "Subscribing..." : buttonText}
          </Button>
        </div>
      </div>
      {errors.name && (
        <p className="text-red-300 text-sm mt-2 text-center">
          {errors.name.message}
        </p>
      )}
      {errors.phone && (
        <p className="text-red-300 text-sm mt-2 text-center">
          {errors.phone.message}
        </p>
      )}
      {submitStatus === "success" && (
        <p className="text-green-300 text-sm mt-2 text-center">
          Successfully subscribed! We&apos;ll notify you about new homes.
        </p>
      )}
      {submitStatus === "error" && (
        <p className="text-red-300 text-sm mt-2 text-center">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
};
