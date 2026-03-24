"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { IconCheck, IconX } from "@tabler/icons-react";
import Lottie from "lottie-react";
import { cn } from "@/lib/utils";
import { CTA_IDS } from "@/lib/cta-ids";
import { Button } from "@/components/ui/Button";
import { useLottieData } from "@/hooks/useLottieData";
import {
  mapNotificationTrackingType,
  NotificationCloseSource,
  NotificationSurface,
  trackNotificationFormFieldCompleted,
  trackNotificationFormStarted,
  trackNotificationFormSubmitAttempted,
  trackNotificationFormSubmitFailed,
  trackNotificationFormSubmitSucceeded,
  trackNotificationModalClosed,
} from "@/lib/posthog-tracking";

type NotificationType =
  | "specific room"
  | "specific home"
  | "all homes"
  | "upcoming home";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  notificationType: NotificationType;
  propertyId?: string;
  propertyName?: string;
  roomId?: string;
  submitLabel?: string;
  submitCtaId?: string;
  surface: NotificationSurface;
  journeyMapSessionId?: string;
}

type UIState = "idle" | "error" | "success";

export const NotificationModal = ({
  isOpen,
  onClose,
  title,
  description,
  notificationType,
  propertyId,
  propertyName,
  roomId,
  submitLabel = "Notify Me",
  submitCtaId = CTA_IDS.PHONE_SUBSCRIBE_SUBMIT,
  surface,
  journeyMapSessionId,
}: NotificationModalProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [uiState, setUiState] = useState<UIState>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const houseLottie = useLottieData("/lotties/home-bounce.json");
  const [hasStarted, setHasStarted] = useState(false);
  const [completedFields, setCompletedFields] = useState<Set<"name" | "phone">>(
    new Set()
  );
  const [submitStartMs, setSubmitStartMs] = useState<number | null>(null);
  const closeSourceRef = useRef<NotificationCloseSource>("overlay");
  const closeTrackedRef = useRef(false);

  const trackingPayload = useMemo(
    () =>
      ({
        type: mapNotificationTrackingType(notificationType),
        surface,
        notification_type: notificationType,
        cta_id: submitCtaId,
        property_id: propertyId,
        property_name: propertyName,
        room_id: roomId,
        journey_map_session_id: journeyMapSessionId,
      } as const),
    [
      journeyMapSessionId,
      notificationType,
      propertyId,
      propertyName,
      roomId,
      submitCtaId,
      surface,
    ]
  );

  const trackCloseOnce = (source: NotificationCloseSource) => {
    if (closeTrackedRef.current) return;
    closeTrackedRef.current = true;
    trackNotificationModalClosed({
      ...trackingPayload,
      close_source: source,
    });
  };

  const normalizedPhone = useMemo(() => phone.replace(/\D/g, ""), [phone]);
  const isSuccess = uiState === "success";

  useEffect(() => {
    if (!isSuccess) return;
    closeSourceRef.current = "auto_success_close";
    if (submitStartMs) {
      trackNotificationFormSubmitSucceeded({
        ...trackingPayload,
        form_variant: "phone",
        submit_latency_ms: Date.now() - submitStartMs,
      });
    } else {
      trackNotificationFormSubmitSucceeded({
        ...trackingPayload,
        form_variant: "phone",
      });
    }
    const timeout = setTimeout(() => {
      trackCloseOnce("auto_success_close");
      onClose();
    }, 2000);
    return () => clearTimeout(timeout);
  }, [isSuccess, onClose, submitStartMs, trackingPayload]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("notification-modal-open");
      return () => {
        document.body.classList.remove("notification-modal-open");
      };
    }
    document.body.classList.remove("notification-modal-open");
    return undefined;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setPhone("");
      setUiState("idle");
      setErrorMessage("");
      setIsSubmitting(false);
      setHasStarted(false);
      setCompletedFields(new Set());
      setSubmitStartMs(null);
      closeSourceRef.current = "overlay";
      closeTrackedRef.current = false;
    }
  }, [isOpen]);

  const trackStarted = (trigger: "first_focus" | "first_input") => {
    if (hasStarted) return;
    setHasStarted(true);
    trackNotificationFormStarted({
      ...trackingPayload,
      start_trigger: trigger,
    });
  };

  const trackFieldCompleted = (field: "name" | "phone", value: string) => {
    if (completedFields.has(field)) return;
    const isComplete =
      field === "name" ? value.trim().length >= 2 : value.replace(/\D/g, "").length >= 8;
    if (!isComplete) return;

    setCompletedFields((prev) => new Set(prev).add(field));
    trackNotificationFormFieldCompleted({
      ...trackingPayload,
      field_name: field,
      completion_method: "valid_pattern",
    });
  };

  const handlePhoneChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    setPhone(digitsOnly);
    trackStarted("first_input");
    trackFieldCompleted("phone", digitsOnly);
    if (uiState === "error") {
      setUiState("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSuccess) return;
    const isValidationPassed =
      name.trim().length >= 2 &&
      normalizedPhone.length >= 8 &&
      normalizedPhone.length <= 10;

    trackNotificationFormSubmitAttempted({
      ...trackingPayload,
      form_variant: "phone",
      validation_passed: isValidationPassed,
    });

    if (!name.trim() || name.trim().length < 2) {
      setUiState("error");
      setErrorMessage("Name is required");
      trackNotificationFormSubmitFailed({
        ...trackingPayload,
        form_variant: "phone",
        failure_stage: "client_validation",
        error_code: "missing_name",
      });
      return;
    }

    if (normalizedPhone.length < 8 || normalizedPhone.length > 10) {
      setUiState("error");
      setErrorMessage("Phone number is invalid");
      trackNotificationFormSubmitFailed({
        ...trackingPayload,
        form_variant: "phone",
        failure_stage: "client_validation",
        error_code: "invalid_phone_length",
      });
      return;
    }

    try {
      setSubmitStartMs(Date.now());
      setIsSubmitting(true);
      setUiState("idle");
      setErrorMessage("");

      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: normalizedPhone,
          notification_type: notificationType,
          property_id: propertyId,
          property_name: propertyName,
          room_id: roomId,
        }),
      });

      if (!response.ok) {
        trackNotificationFormSubmitFailed({
          ...trackingPayload,
          form_variant: "phone",
          failure_stage: response.status >= 500 ? "api_5xx" : "api_4xx",
          error_code: "server_error",
        });
        throw new Error("Submission failed");
      }

      setUiState("success");
    } catch (error) {
      console.error("Notification submit error:", error);
      setUiState("error");
      setErrorMessage("Something went wrong. Please try again.");
      trackNotificationFormSubmitFailed({
        ...trackingPayload,
        form_variant: "phone",
        failure_stage: "network",
        error_code: "unknown",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          trackCloseOnce(closeSourceRef.current);
          onClose();
        }
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[190] bg-black/80"
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content
              asChild
              onEscapeKeyDown={() => {
                closeSourceRef.current = "esc";
              }}
              onPointerDownOutside={() => {
                closeSourceRef.current = "overlay";
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: "20%", x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, y: "20%", x: "-50%" }}
                transition={{ type: "spring", stiffness: 280, damping: 28 }}
                className={cn(
                  "fixed left-1/2 z-[200] w-[calc(100vw-0.75rem)] max-w-none border border-black/20 bg-[#ECE8E5] px-4 pb-6 pt-5 shadow-lg",
                  "bottom-2 rounded-[2.5rem] md:top-1/2 md:bottom-auto md:w-auto md:max-w-[42rem] md:-translate-y-1/2 md:rounded-[2rem] md:px-8"
                )}
              >
                <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-text-main/90 md:hidden" />

                <DialogPrimitive.Close
                  className="absolute right-5 top-5 hidden rounded-sm opacity-70 transition-opacity hover:opacity-100 md:inline-flex"
                  onClick={() => {
                    closeSourceRef.current = "x_button";
                  }}
                >
                  <IconX className="h-5 w-5 text-text-main/80" />
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>

                <div className="mx-auto mb-1 flex w-full max-w-[17rem] flex-col items-center text-center md:max-w-none">
                  <div className="notification-modal-house mb-3">
                    {houseLottie ? (
                      <Lottie
                        animationData={houseLottie}
                        loop
                        autoplay
                        className="h-full w-full object-contain"
                      />
                    ) : null}
                  </div>
                  <DialogPrimitive.Title className="font-zin text-[2.7rem] leading-[0.95] text-forest-green md:whitespace-nowrap">
                    {title}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="mt-2 text-base text-text-main/90 md:whitespace-nowrap">
                    {description}
                  </DialogPrimitive.Description>
                </div>

                <form onSubmit={handleSubmit} className="mt-5">
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                        trackStarted("first_input");
                        trackFieldCompleted("name", event.target.value);
                        if (uiState === "error") {
                          setUiState("idle");
                          setErrorMessage("");
                        }
                      }}
                      onFocus={() => trackStarted("first_focus")}
                      disabled={isSubmitting || isSuccess}
                      className="h-12 w-full rounded-l-none rounded-r-xl border border-black/20 bg-white px-4 text-base text-text-main outline-none placeholder:text-text-main/50 focus:border-black/70"
                    />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      inputMode="numeric"
                      maxLength={10}
                      value={phone}
                      onChange={(event) => handlePhoneChange(event.target.value)}
                      onFocus={() => trackStarted("first_focus")}
                      disabled={isSubmitting || isSuccess}
                      className="h-12 w-full rounded-l-none rounded-r-xl border border-black/20 bg-white px-4 text-base text-text-main outline-none placeholder:text-text-main/40 focus:border-black/70"
                    />
                  </div>

                  {uiState === "error" && (
                    <p className="mt-2 text-center text-sm text-[#C74D4D]">{errorMessage}</p>
                  )}

                  <Button
                    type="submit"
                    size="md"
                    variant="primary"
                    disabled={isSubmitting || isSuccess}
                    data-cta-id={submitCtaId}
                    data-cta-context="notification_modal"
                    className={cn(
                      "mt-4 w-full rounded-l-none rounded-r-xl !justify-center",
                      isSuccess && "!bg-forest-green"
                    )}
                  >
                    {isSuccess ? (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-forest-green">
                        <IconCheck size={16} stroke={2.5} />
                      </span>
                    ) : isSubmitting ? (
                      <span
                        className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white"
                        aria-label="Submitting"
                      />
                    ) : (
                      submitLabel
                    )}
                  </Button>
                </form>

                <button
                  type="button"
                  onClick={() => {
                    closeSourceRef.current = "go_back";
                    onClose();
                  }}
                  className="mt-3 w-full text-center font-heading text-button-link text-text-main md:hidden"
                >
                  Go back
                </button>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};
