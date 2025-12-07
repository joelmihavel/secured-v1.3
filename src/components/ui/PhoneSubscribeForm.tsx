"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { submitInterestLeads } from "@/lib/hubspot";

interface PhoneSubscribeFormProps {
    propertyInterest?: string;
    placeholder?: string;
    buttonText?: string;
    className?: string;
}

interface FormData {
    phone: string;
}

export const PhoneSubscribeForm = ({
    propertyInterest = "all_properties",
    placeholder = "Your phone number",
    buttonText = "Subscribe",
    className = ""
}: PhoneSubscribeFormProps) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>();
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleFormSubmit = async (data: FormData) => {
        try {
            setSubmitStatus('idle');
            await submitInterestLeads({
                phone: data.phone,
                Property_Interest: propertyInterest
            });
            setSubmitStatus('success');
            reset();
            // Reset success message after 3 seconds
            setTimeout(() => setSubmitStatus('idle'), 3000);
        } catch (error) {
            console.error('Form submission error:', error);
            setSubmitStatus('error');
            // Reset error message after 3 seconds
            setTimeout(() => setSubmitStatus('idle'), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className={`max-w-md mx-auto mb-4 ${className}`}>
            <div className="flex gap-2">
                <input
                    type="tel"
                    placeholder={placeholder}
                    {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                            value: /^[0-9+\-\s()]+$/,
                            message: "Please enter a valid phone number"
                        }
                    })}
                    className="flex-1 px-6 py-3 rounded-full border border-white/20 focus:outline-none focus:ring-2 focus:ring-white bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60"
                    disabled={isSubmitting}
                />
                <Button 
                    type="submit" 
                    size="md" 
                    className="px-8 bg-white text-ground-brown hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Subscribing...' : buttonText}
                </Button>
            </div>
            {errors.phone && (
                <p className="text-red-300 text-sm mt-2 text-center">{errors.phone.message}</p>
            )}
            {submitStatus === 'success' && (
                <p className="text-green-300 text-sm mt-2 text-center">Successfully subscribed! We'll notify you about new homes.</p>
            )}
            {submitStatus === 'error' && (
                <p className="text-red-300 text-sm mt-2 text-center">Something went wrong. Please try again.</p>
            )}
        </form>
    );
};
