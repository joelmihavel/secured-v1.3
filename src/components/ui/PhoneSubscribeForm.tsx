"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { CTA_IDS } from "@/lib/cta-ids";
import {
  mapNotificationTrackingType,
  NotificationSurface,
  trackClickedGetNotifiied,
  trackNotificationFormFieldCompleted,
  trackNotificationFormStarted,
  trackNotificationFormSubmitAttempted,
  trackNotificationFormSubmitFailed,
  trackNotificationFormSubmitSucceeded,
} from "@/lib/posthog-tracking";

export interface PhoneSubscribeFormProps {
  notificationType: "specific room" | "specific home" | "all homes" | "upcoming home";
  propertyId?: string;
  propertyName?: string;
  roomId?: string;
  placeholder?: string;
  buttonText?: string;
  className?: string;
  useEmail?: boolean; // If true, use email field; if false (default), use phone field
  surface?: NotificationSurface;
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
  surface,
}: PhoneSubscribeFormProps) => {
  const defaultPlaceholder = useEmail 
    ? "Enter your email address" 
    : "+91 | Enter your phone number";
  
  const phoneForm = useForm<PhoneFormData>();
  const emailForm = useForm<EmailFormData>();
  
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [hasStarted, setHasStarted] = useState(false);
  const [completedFields, setCompletedFields] = useState<Set<"name" | "phone" | "email">>(new Set());
  const [submitStartMs, setSubmitStartMs] = useState<number | null>(null);
  const effectiveSurface: NotificationSurface =
    surface ||
    (notificationType === "all homes"
      ? "homepage_newsletter"
      : notificationType === "upcoming home"
      ? "coming_soon_card"
      : notificationType === "specific home"
      ? "property_slug_full_house"
      : "property_slug_room");
  const basePayload = {
    type: mapNotificationTrackingType(notificationType),
    surface: effectiveSurface,
    notification_type: notificationType,
    property_id: propertyId,
    property_name: propertyName,
    room_id: roomId,
  } as const;
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const trackStarted = (trigger: "first_focus" | "first_input") => {
    if (hasStarted) return;
    setHasStarted(true);
    trackNotificationFormStarted({
      ...basePayload,
      start_trigger: trigger,
    });
  };

  const trackFieldCompleted = (
    field: "name" | "phone" | "email",
    value: string
  ) => {
    if (completedFields.has(field)) return;
    const isComplete =
      field === "name"
        ? value.trim().length >= 2
        : field === "phone"
        ? value.replace(/\D/g, "").length >= 8
        : emailRegex.test(value);
    if (!isComplete) return;

    setCompletedFields((prev) => new Set(prev).add(field));
    trackNotificationFormFieldCompleted({
      ...basePayload,
      field_name: field,
      completion_method: "valid_pattern",
    });
  };

  const handlePhoneSubmit = async (data: PhoneFormData) => {
    try {
      trackNotificationFormSubmitAttempted({
        ...basePayload,
        form_variant: "phone",
        validation_passed: true,
      });
      setSubmitStartMs(Date.now());
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
        trackNotificationFormSubmitFailed({
          ...basePayload,
          form_variant: "phone",
          failure_stage: response.status >= 500 ? "api_5xx" : "api_4xx",
          error_code: "server_error",
        });
        throw new Error("Submission failed");
      }

      setSubmitStatus("success");
      trackNotificationFormSubmitSucceeded({
        ...basePayload,
        form_variant: "phone",
        submit_latency_ms: submitStartMs ? Date.now() - submitStartMs : undefined,
      });
      phoneForm.reset();
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
      trackNotificationFormSubmitFailed({
        ...basePayload,
        form_variant: "phone",
        failure_stage: "network",
        error_code: "unknown",
      });
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
  };

  const handleEmailSubmit = async (data: EmailFormData) => {
    try {
      trackNotificationFormSubmitAttempted({
        ...basePayload,
        form_variant: "email",
        validation_passed: true,
      });
      setSubmitStartMs(Date.now());
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
        trackNotificationFormSubmitFailed({
          ...basePayload,
          form_variant: "email",
          failure_stage: response.status >= 500 ? "api_5xx" : "api_4xx",
          error_code: "server_error",
        });
        throw new Error("Submission failed");
      }

      setSubmitStatus("success");
      trackNotificationFormSubmitSucceeded({
        ...basePayload,
        form_variant: "email",
        submit_latency_ms: submitStartMs ? Date.now() - submitStartMs : undefined,
      });
      emailForm.reset();
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
      trackNotificationFormSubmitFailed({
        ...basePayload,
        form_variant: "email",
        failure_stage: "network",
        error_code: "unknown",
      });
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
  };

  if (useEmail) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = emailForm;
    
    return (
      <form
        onSubmit={handleSubmit(handleEmailSubmit, () => {
          trackNotificationFormSubmitAttempted({
            ...basePayload,
            form_variant: "email",
            validation_passed: false,
          });
          trackNotificationFormSubmitFailed({
            ...basePayload,
            form_variant: "email",
            failure_stage: "client_validation",
            error_code: "invalid_email",
          });
        })}
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
              onChange: (e) => {
                trackStarted("first_input");
                trackFieldCompleted("email", e.target.value);
              },
            })}
            onFocus={() => trackStarted("first_focus")}
            className="flex-1 px-6 py-3 rounded-l-[1rem] border border-white/20 focus:outline-none focus:ring-2 focus:ring-white bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60"
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            size="md"
            variant="primary"
            disabled={isSubmitting}
            className="w-full md:w-auto"
            data-cta-id={CTA_IDS.EMAIL_SUBSCRIBE_SUBMIT}
            data-cta-context="email_subscribe_form"
            onClick={() => {
              trackClickedGetNotifiied({
                ...basePayload,
                cta_id: CTA_IDS.EMAIL_SUBSCRIBE_SUBMIT,
              });
            }}
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
      onSubmit={handleSubmit(handlePhoneSubmit, () => {
        trackNotificationFormSubmitAttempted({
          ...basePayload,
          form_variant: "phone",
          validation_passed: false,
        });
        trackNotificationFormSubmitFailed({
          ...basePayload,
          form_variant: "phone",
          failure_stage: "client_validation",
          error_code: "invalid_phone_length",
        });
      })}
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
            onChange: (e) => {
              trackStarted("first_input");
              trackFieldCompleted("name", e.target.value);
            },
          })}
          onFocus={() => trackStarted("first_focus")}
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
              onChange: (e) => {
                trackStarted("first_input");
                trackFieldCompleted("phone", e.target.value);
              },
            })}
            onFocus={() => trackStarted("first_focus")}
            className="flex-1 px-6 py-3 rounded-l-[1rem] border border-white/20 focus:outline-none focus:ring-2 focus:ring-white bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60"
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            size="md"
            variant="primary"
            disabled={isSubmitting}
            className="w-full md:w-auto"
            data-cta-id={CTA_IDS.PHONE_SUBSCRIBE_SUBMIT}
            data-cta-context="phone_subscribe_form"
            onClick={() => {
              trackClickedGetNotifiied({
                ...basePayload,
                cta_id: CTA_IDS.PHONE_SUBSCRIBE_SUBMIT,
              });
            }}
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
