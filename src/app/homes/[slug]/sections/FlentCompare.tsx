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
import { Marquee } from "@/components/ui/Marquee";
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
    { text: "Fully Furnished Designer Home", icon: Armchair, bgColor: "var(--color-brick-red)", textColor: "var(--color-brand-yellow)", borderColor: "var(--color-brand-yellow)" },
    { text: "24/7 Resident Support", icon: Headphones, bgColor: "var(--color-night-violet)", textColor: "var(--color-brand-cyan)", borderColor: "var(--color-brand-cyan)" },
    { text: "Quick Issue Resolution", icon: Zap, bgColor: "var(--color-forest-green)", textColor: "var(--color-brand-orange)", borderColor: "var(--color-brand-orange)" },
    { text: "Complete Appliances", icon: Plug, bgColor: "var(--color-ground-brown)", textColor: "var(--color-brand-pink)", borderColor: "var(--color-brand-pink)" },
    { text: "Fully Equipped Kitchen", icon: Utensils, bgColor: "var(--color-night-violet)", textColor: "var(--color-brand-yellow)", borderColor: "var(--color-brand-yellow)" },
    { text: "Routine Maintenance", icon: Wrench, bgColor: "var(--color-brick-red)", textColor: "var(--color-brand-cyan)", borderColor: "var(--color-brand-cyan)" },
    { text: "Dedicated Workspace", icon: Laptop, bgColor: "var(--color-ground-brown)", textColor: "var(--color-brand-orange)", borderColor: "var(--color-brand-orange)" },
    { text: "Power Backup", icon: BatteryCharging, bgColor: "var(--color-forest-green)", textColor: "var(--color-brand-yellow)", borderColor: "var(--color-brand-yellow)" },
    { text: "Minimal Deposit", icon: Wallet, bgColor: "var(--color-night-violet)", textColor: "var(--color-brand-cyan)", borderColor: "var(--color-brand-cyan)" },
    { text: "Zero Brokerage", icon: BadgeCheck, bgColor: "var(--color-brick-red)", textColor: "var(--color-brand-yellow)", borderColor: "var(--color-brand-yellow)" },
    { text: "No Landlord Interference", icon: Shield, bgColor: "var(--color-ground-brown)", textColor: "var(--color-brand-orange)", borderColor: "var(--color-brand-orange)" },
    { text: "Flatmate Matching", icon: Users, bgColor: "var(--color-forest-green)", textColor: "var(--color-brand-yellow)", borderColor: "var(--color-brand-yellow)" },
    { text: "Guaranteed Deposit Return", icon: CircleDollarSign, bgColor: "var(--color-night-violet)", textColor: "var(--color-brand-yellow)", borderColor: "var(--color-brand-yellow)" },
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

const Chip = ({ item }: { item: CompareItem }) => (
    <div
        className="px-3 py-1.5 md:px-8 md:py-4 rounded-full text-xs md:text-xl font-semibold whitespace-nowrap shadow-lg flex items-center gap-1.5 md:gap-4 mx-2 md:mx-4 border border-white/10"
        style={{
            backgroundColor: item.bgColor,
            color: item.textColor,

            boxShadow: `0 4px 12px ${item.borderColor}20`,
        }}
    >
        <item.icon className="w-3 h-3 md:w-6 md:h-6" strokeWidth={2} />
        {item.text}
    </div>
);



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

                <div className="w-full relative z-10 h-[65vh] md:h-[calc(45vh+232px)]">
                    <AnimatePresence mode="wait">
                        {activeTab === "flent" ? (
                            <motion.div
                                key="flent"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-full"
                            >
                                <TabsContent value="flent" className="w-full m-0 h-full flex flex-col" forceMount>
                                    {/* Header Section */}
                                    <div className="w-full flex-shrink-0 flex items-center justify-center pt-2 pb-4">
                                        <div className="text-center max-w-3xl mx-auto">

                                            <h2 className="font-heading text-fluid-h2 text-text-main">
                                                Just get your clothes <br className="hidden md:block" /> <span className="font-zin-italic opacity-60">And start living</span>
                                            </h2>
                                            <p className="text-sm md:text-subtitle-sm font-medium text-text-main/70 pt-4">
                                                We do all the heavy lifting so that you don’t have to.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Carousel Section */}
                                    <div
                                        className="relative w-screen ml-[calc(50%-50vw)] flex-1 overflow-hidden flex flex-col justify-center gap-6 md:gap-12"
                                    >
                                        <Marquee duration={200} className="w-full" repeat={4}>
                                            {withFlentItems.slice(0, 5).map((item, i) => (
                                                <Chip key={i} item={item} />
                                            ))}
                                        </Marquee>
                                        <Marquee duration={200} reverse className="w-full" repeat={4}>
                                            {withFlentItems.slice(5, 9).map((item, i) => (
                                                <Chip key={i} item={item} />
                                            ))}
                                        </Marquee>
                                        <Marquee duration={200} className="w-full" repeat={4}>
                                            {withFlentItems.slice(9).map((item, i) => (
                                                <Chip key={i} item={item} />
                                            ))}
                                        </Marquee>
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
                                className="w-full h-full"
                            >
                                <TabsContent value="without" className="w-full m-0 h-full" forceMount>
                                    {/* Full Height Canvas Section (Header Height + Canvas Height) */}
                                    <div className="relative w-full overflow-hidden h-full rounded-lg">
                                        <Gravity gravity={{ x: 0, y: 2.5 }} className="w-full h-full" addTopWall resetOnResize={false}>
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
                                                        className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap cursor-grab active:cursor-grabbing shadow-sm flex items-center gap-1.5 md:gap-2 "
                                                        style={{
                                                            backgroundColor: item.bgColor,
                                                            color: item.textColor,
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
                                                        Why go through <span className="font-zin-italic opacity-60">all this?</span>
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
