"use client";

import { CardSection } from "@/components/layout/CardSection";
import {
    IconArmchair as Armchair,
    IconRosetteDiscountCheck as BadgeCheck,
    IconWallet as Wallet,
    IconBolt as Zap,
    IconBatteryCharging as BatteryCharging,
    IconToolsKitchen2 as Utensils,
    IconPlug as Plug,
    IconDeviceLaptop as Laptop,
    IconTool as Wrench,
    IconCashBanknote as Banknote,
    IconShoppingCart as ShoppingCart,
    IconPhone as Phone,
    IconCoins as HandCoins,
    IconHammer as Hammer,
    IconAlertCircle as AlertCircle,
    IconWifi as Wifi,
    IconSearch as Search,
    IconTrendingUp as TrendingUp,
    IconFileX as FileX,
    IconUsers as Users,
    IconCurrencyDollar as CircleDollarSign,
    IconSparkles as Sparkles,
    IconHeadphones as Headphones,
    IconShield as Shield,
    Icon as LucideIcon
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { Gravity, MatterBody } from "@/components/ui/gravity";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

type CompareItem = {
    text: string;
    icon: LucideIcon;
    bgColor: string;
    textColor: string;
    borderColor: string;
};

const withFlentItems: CompareItem[] = [
    { text: "Fully Furnished Designer Home", icon: Armchair, bgColor: "var(--color-brick-red)", textColor: "var(--color-brand-cyan)", borderColor: "var(--color-brand-cyan)" },
    { text: "24/7 Resident Support", icon: Headphones, bgColor: "var(--color-night-violet)", textColor: "var(--color-brand-yellow)", borderColor: "var(--color-brand-yellow)" },
    { text: "Quick Issue Resolution", icon: Zap, bgColor: "var(--color-forest-green)", textColor: "var(--color-brand-pink)", borderColor: "var(--color-brand-pink)" },
    { text: "Complete Appliances", icon: Plug, bgColor: "var(--color-ground-brown)", textColor: "var(--color-brand-orange)", borderColor: "var(--color-brand-orange)" },
    { text: "Fully Equipped Kitchen", icon: Utensils, bgColor: "var(--color-brick-red)", textColor: "var(--color-brand-cyan)", borderColor: "var(--color-brand-cyan)" },
    { text: "Routine Maintenance", icon: Wrench, bgColor: "var(--color-night-violet)", textColor: "var(--color-brand-yellow)", borderColor: "var(--color-brand-yellow)" },
    { text: "Dedicated Workspace", icon: Laptop, bgColor: "var(--color-forest-green)", textColor: "var(--color-brand-pink)", borderColor: "var(--color-brand-pink)" },
    { text: "Power Backup", icon: BatteryCharging, bgColor: "var(--color-ground-brown)", textColor: "var(--color-brand-orange)", borderColor: "var(--color-brand-orange)" },
    { text: "Minimal Deposit", icon: Wallet, bgColor: "var(--color-brick-red)", textColor: "var(--color-brand-cyan)", borderColor: "var(--color-brand-cyan)" },
    { text: "Zero Brokerage", icon: BadgeCheck, bgColor: "var(--color-night-violet)", textColor: "var(--color-brand-yellow)", borderColor: "var(--color-brand-yellow)" },
    { text: "No Landlord Interference", icon: Shield, bgColor: "var(--color-forest-green)", textColor: "var(--color-brand-pink)", borderColor: "var(--color-brand-pink)" },
    { text: "Flatmate Matching", icon: Users, bgColor: "var(--color-ground-brown)", textColor: "var(--color-brand-orange)", borderColor: "var(--color-brand-orange)" },
    { text: "Guaranteed Deposit Return", icon: CircleDollarSign, bgColor: "var(--color-brick-red)", textColor: "var(--color-brand-cyan)", borderColor: "var(--color-brand-cyan)" },
];

const withoutFlentItems: CompareItem[] = [
    { text: "High deposits", icon: Banknote, bgColor: "var(--color-brand-yellow)", textColor: "var(--color-text-main)", borderColor: "var(--color-text-main)" },
    { text: "Buy or rent furniture", icon: ShoppingCart, bgColor: "var(--color-pastel-brown)", textColor: "var(--color-text-main)", borderColor: "var(--color-text-main)" },
    { text: "Set up WiFi", icon: Wifi, bgColor: "var(--color-pastel-brown)", textColor: "var(--color-text-main)", borderColor: "var(--color-text-main)" },
    { text: "Endless house hunting", icon: Search, bgColor: "var(--color-brand-yellow)", textColor: "var(--color-text-main)", borderColor: "var(--color-text-main)" },
    { text: "Hidden costs", icon: AlertCircle, bgColor: "var(--color-pastel-brown)", textColor: "var(--color-text-main)", borderColor: "var(--color-text-main)" },
    { text: "Surprise rental hikes", icon: TrendingUp, bgColor: "var(--color-pastel-brown)", textColor: "var(--color-text-main)", borderColor: "var(--color-text-main)" },
    { text: "Broker fees", icon: HandCoins, bgColor: "var(--color-brand-yellow)", textColor: "var(--color-text-main)", borderColor: "var(--color-text-main)" },
    { text: "Unreasonable landlord rules", icon: FileX, bgColor: "var(--color-pastel-brown)", textColor: "var(--color-text-main)", borderColor: "var(--color-text-main)" },
    { text: "Call every service yourself", icon: Phone, bgColor: "var(--color-pastel-brown)", textColor: "var(--color-text-main)", borderColor: "var(--color-text-main)" },
    { text: "DIY repairs", icon: Hammer, bgColor: "var(--color-brand-yellow)", textColor: "var(--color-text-main)", borderColor: "var(--color-text-main)" },
    { text: "Flatmate hunting", icon: Users, bgColor: "var(--color-pastel-brown)", textColor: "var(--color-text-main)", borderColor: "var(--color-text-main)" },
    { text: "Deposit refund stress", icon: CircleDollarSign, bgColor: "var(--color-pastel-brown)", textColor: "var(--color-text-main)", borderColor: "var(--color-text-main)" },
    { text: "Move-in cleaning", icon: Sparkles, bgColor: "var(--color-brand-yellow)", textColor: "var(--color-text-main)", borderColor: "var(--color-text-main)" },
];

export const FlentCompare = () => {
    const [activeTab, setActiveTab] = useState("flent");

    // eslint-disable-next-line react-hooks/purity
    const angles = useMemo(() => Array.from({ length: 20 }).map(() => Math.random() * 20 - 10), []);

    return (
        <CardSection
            id="compare"
            className="bg-pastel-brown/20"
            paddingX="none"
            backgroundPattern={activeTab === "without" ? "none" : "/patterns/jupiter.svg"}
            patternOpacity={0.02}
            patternMask={activeTab === "without" ? "none" : "to-bottom"}
            paddingY="none"
        >
            <Tabs
                defaultValue="flent"
                className="w-full flex flex-col items-center pt-12"
                onValueChange={setActiveTab}
                variant="pill"
            >
                {/* Tabs at the top */}
                <div className="w-full flex justify-center mb-8 relative z-20">
                    <TabsList>
                        <TabsTrigger value="flent">
                            With Flent
                        </TabsTrigger>
                        <TabsTrigger value="without">
                            Without Flent
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="w-full max-w-7xl relative z-10">
                    <AnimatePresence mode="wait">
                        {activeTab === "flent" ? (
                            <motion.div
                                key="flent"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                <TabsContent value="flent" className="w-full m-0 space-y-8" forceMount>
                                    {/* Header Section */}
                                    <div className="w-full flex items-center justify-center pt-2">
                                        <div className="text-center max-w-3xl mx-auto">

                                            <h2 className="font-heading text-fluid-h2 text-text-main">
                                                Just get your clothes <br /> <span className="font-zin font-light opacity-60">And start living</span>
                                            </h2>
                                            <p className="text-sm md:text-subtitle-sm font-medium mb-4 text-text-main/70 pt-4">
                                                We do all the heavy lifting so that you don’t have to.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Canvas Section */}
                                    <div className="relative w-full overflow-hidden h-[30vh] md:h-[45vh] rounded-lg">
                                        <Gravity gravity={{ x: 0, y: 1 }} className="w-full h-full" addTopWall>
                                            {withFlentItems.map((item, i) => (
                                                <MatterBody
                                                    key={`with-${i}`}
                                                    x={`${15 + (i * 12) % 70}%`}
                                                    y={`${10 + (i * 10) % 40}%`}
                                                    angle={angles[i]}
                                                    matterBodyOptions={{ friction: 0.5, restitution: 0.4, density: 0.001 }}
                                                >
                                                    <div
                                                        className="px-4 py-2 md:px-8 md:py-4 rounded-full text-sm md:text-xl font-semibold whitespace-nowrap cursor-grab active:cursor-grabbing shadow-lg flex items-center gap-2 md:gap-4 border-2"
                                                        style={{
                                                            backgroundColor: item.bgColor,
                                                            color: item.textColor,
                                                            borderColor: item.borderColor
                                                        }}
                                                    >
                                                        <item.icon className="w-4 h-4 md:w-6 md:h-6" strokeWidth={2} />
                                                        {item.text}
                                                    </div>
                                                </MatterBody>
                                            ))}
                                        </Gravity>
                                    </div>
                                </TabsContent>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="without"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                <TabsContent value="without" className="w-full m-0" forceMount>
                                    {/* Full Height Canvas Section (Header Height + Canvas Height) */}
                                    <div className="relative w-full overflow-hidden h-[50vh] md:h-[calc(45vh+232px)] rounded-lg">
                                        <Gravity gravity={{ x: 0, y: 2.5 }} className="w-full h-full" addTopWall>
                                            {/* Burden pills - start at top, fall immediately */}
                                            {withoutFlentItems.map((item, i) => (
                                                <MatterBody
                                                    key={`without-${i}`}
                                                    x={`${15 + (i * 12) % 70}%`}
                                                    y={`${5 + (i * 2) % 5}%`}
                                                    angle={angles[i]}
                                                    matterBodyOptions={{ friction: 0.9, restitution: 0.1, density: 0.05, frictionAir: 0.05 }}
                                                >
                                                    <div
                                                        className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap cursor-grab active:cursor-grabbing shadow-sm flex items-center gap-1.5 md:gap-2 border border-black/15"
                                                        style={{
                                                            backgroundColor: item.bgColor,
                                                            color: item.textColor,
                                                            borderColor: item.textColor
                                                        }}
                                                    >
                                                        <item.icon className="w-3 h-3 md:w-4 md:h-4" strokeWidth={1.5} />
                                                        {item.text}
                                                    </div>
                                                </MatterBody>
                                            ))}

                                            {/* Heading and subheading - delayed fall */}
                                            <MatterBody
                                                key="without-heading"
                                                x="50%"
                                                y="5%"
                                                angle={0}
                                                delay={1800}
                                                className="z-20"
                                                matterBodyOptions={{ friction: 0.9, restitution: 0.1, density: 0.05, frictionAir: 0.05 }}
                                            >
                                                <div>
                                                    <h2 className="font-heading text-text-main text-fluid-h2 whitespace-nowrap text-center">
                                                        Why go through <span className="font-zin font-light opacity-60">all this?</span>
                                                    </h2>
                                                </div>
                                            </MatterBody>

                                            <MatterBody
                                                key="without-subheading"
                                                x="50%"
                                                y="15%"
                                                angle={0}
                                                delay={1500}
                                                className="z-10"
                                                matterBodyOptions={{ friction: 0.9, restitution: 0.1, density: 0.05, frictionAir: 0.05 }}
                                            >
                                                <div className=" max-w-xl text-center">
                                                    <p className="text-xs md:text-sm font-medium text-text-main/90">
                                                        Weeks of house hunting. Move in hassle. A home that isn’t ready for you.
                                                    </p>
                                                </div>
                                            </MatterBody>
                                        </Gravity>
                                    </div>
                                </TabsContent>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Tabs>
        </CardSection>
    );
};
