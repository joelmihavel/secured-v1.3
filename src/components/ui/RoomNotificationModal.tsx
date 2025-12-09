"use client";

import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { PhoneSubscribeForm } from "@/components/ui/PhoneSubscribeForm";
import { cn } from "@/lib/utils";

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
        <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
            <AnimatePresence>
                {isOpen && (
                    <DialogPrimitive.Portal forceMount>
                        <DialogPrimitive.Overlay asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="fixed inset-0 z-50 bg-black/80"
                            />
                        </DialogPrimitive.Overlay>
                        <DialogPrimitive.Content asChild>
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.95,
                                    y: "-40%",
                                    x: "-50%",
                                    filter: "blur(10px)"
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: "-50%",
                                    x: "-50%",
                                    filter: "blur(0px)"
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.95,
                                    y: "-40%",
                                    x: "-50%",
                                    filter: "blur(10px)"
                                }}
                                transition={{
                                    type: "spring",
                                    damping: 25,
                                    stiffness: 300,
                                    duration: 0.3
                                }}
                                className={cn(
                                    "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg gap-4 border p-6 shadow-lg sm:rounded-lg",
                                    "bg-ground-brown text-white border-white/20 sm:max-w-md"
                                )}
                            >
                                <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                                    <DialogPrimitive.Title className="text-2xl font-zin text-white">
                                        Get Notified
                                    </DialogPrimitive.Title>
                                    <DialogPrimitive.Description className="text-white/80">
                                        We'll let you know when {roomName} becomes available.
                                    </DialogPrimitive.Description>
                                </div>
                                <div className="mt-4">
                                    <PhoneSubscribeForm
                                        propertyInterest={propertyInterest}
                                        placeholder="Enter your phone number"
                                        buttonText="Notify Me"
                                        className="max-w-full"
                                    />
                                </div>
                                <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                                    <IconX className="h-4 w-4 text-white" />
                                    <span className="sr-only">Close</span>
                                </DialogPrimitive.Close>
                            </motion.div>
                        </DialogPrimitive.Content>
                    </DialogPrimitive.Portal>
                )}
            </AnimatePresence>
        </DialogPrimitive.Root>
    );
};
