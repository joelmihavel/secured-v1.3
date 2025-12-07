"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { PhoneSubscribeForm } from "@/components/ui/PhoneSubscribeForm";

interface RoomNotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: string;
    roomId: string;
    roomName?: string;
    propertyName?: string;
    }

export const RoomNotificationModal = ({
    isOpen,
    onClose,
    propertyId,
    roomId,
    propertyName = 'Property',
    roomName = "Room"
}: RoomNotificationModalProps) => {
    const propertyInterest = `${propertyName} _ ${roomName} || ${propertyId} _ ${roomId}`;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-ground-brown text-white border-white/20">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-zin text-white">
                        Get Notified
                    </DialogTitle>
                    <DialogDescription className="text-white/80">
                        We'll let you know when {roomName} becomes available.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    <PhoneSubscribeForm
                        propertyInterest={propertyInterest}
                        placeholder="Enter your phone number"
                        buttonText="Notify Me"
                        className="max-w-full"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};
