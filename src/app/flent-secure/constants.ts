
export const TENANT_CONTENT = {
    hero: {
        heading: "Earn <span class='font-zin-italic text-brand-orange px-2 py-0.5 bg-[#FFF0E2] rounded-lg relative inline-block'>1% back</span>",
        subheading: "On every timely <span class='font-zin-italic'>rent payment</span>",
        subtext: "Because habits like yours should be rewarded, not overlooked.",
        cta: "Request an Invite",
        tagline: "This isn't for average renters, really..",
        lottie: "/secure-lotties/Section1.json",
        themeColor: "orange",
        layoutReverse: false
    },
    rentReward: {
        eyebrow: "RENT IS YOUR BIGGEST <span class='relative inline-block'><span class='absolute -bottom-1 left-0 w-full h-[6px] bg-brand-orange/40 -z-10 rounded-full'></span>MONTHLY COMMITMENT</span>",
        heading: "You've handled it responsibly,<br/>but it's <span class='relative inline-block px-4 py-1 ml-1'><span class='absolute inset-0 bg-[#FFF0E2] -z-10 rounded-full transform -rotate-1'></span><span class='font-zin-italic'>never really led to anything</span></span>",
        subtext: "Secured changes that with a simple cashback today, and ultimately opens doors to renting benefits that you truly deserve.",
        features: [
            { icon: "credit_card", title: "1% Cashback on Timely Rental Payment" },
            { icon: "trophy", title: "First Dibs on Upcoming Flent Homes" },
            { icon: "check_circle", title: "Zero Security Deposits" },
            { icon: "design_services", title: "Home Design @ Zero Service Fee" }
        ],
        lottie: "/secure-lotties/section2.json"
    },
    marquee: {
        top: "Welcome to the right side of renting",
        bottom: "Because responsibility should feel rewarding",
        topTextColor: "text-text-main",
        topBgColor: "bg-brand-orange",
        bottomTextColor: "text-brand-orange",
        bottomBgColor: "bg-ground-brown"
    },
    valueProp: {
        heading: "Yes, you can pay rent <br/> using your credit card here",
        subtext: "And yes, you still earn 1% back",
        cta: "Request an Invite",
        lottie: "/lotties/credit_card.json",
        themeColor: "orange"
    },
    getStarted: {
        heading: "Getting started is simple & straightforward",
        steps: [
            { id: "step1", title: "Request your invite", desc: "Share your address, rent amount, & phone number", lottie: "/lotties/step1.png" },
            { id: "step2", title: "Complete your KYC", desc: "Invite your landlord. We handle the rest.", lottie: "/lotties/step2.png" },
            { id: "step3", title: "Landlord accepts", desc: "A free ₹1.5 lakh rental cover activates instantly.", lottie: "/lotties/step3.png" },
            { id: "step4", title: "Pay rent as usual", desc: "Earn 1% back. Every timely payment unlocks more rewards.", lottie: "/lotties/step4.png" }
        ]
    },
    faqCategory: "tenant"
};

export const LANDLORD_CONTENT = {
    hero: {
        heading: "You get <span class='font-zin-italic text-brand-orange px-2 py-0.5 bg-[#FFF0E2] rounded-lg relative inline-block'>Paid</span>",
        subheading: "even after your <span class='font-zin-italic'>tenants vacate</span>",
        subtext: "Protect your rental income from empty months and sudden exits - free of cost.",
        cta: "Secure my Rental Income",
        tagline: "Free Forever | ₹1.5 lakh protection limit | Instant, hassle-free payout",
        lottie: "/secure-lotties/Section1.json",
        themeColor: "orange",
        layoutReverse: true
    },
    rentReward: {
        eyebrow: "YOU INVESTED <span class='relative inline-block'><span class='absolute -bottom-1 left-0 w-full h-[6px] bg-brand-orange/40 -z-10 rounded-full'></span>CRORES INTO THAT HOME</span>",
        heading: "Yet, your rental income is just<br/><span class='relative inline-block px-4 py-1 ml-1'><span class='absolute inset-0 bg-[#FFF0E2] -z-10 rounded-full transform -rotate-1'></span><span class='font-zin-italic'>one event away from disruption</span></span>",
        subtext: "Secured is a protection stack built around your rental asset. It starts with vacancy cover today and expands into smarter tools that future-proof your rental income for whatever comes next.",
        features: [
            { icon: "credit_card", title: "Zero-Cost Vacancy Cover" },
            { icon: "trophy", title: "Zero-cost tenant background verification" },
            { icon: "check_circle", title: "Loan Against Rental Income" },
            { icon: "design_services", title: "Property Damage Cover" }
        ],
        lottie: "/secure-lotties/section2.json"
    },
    marquee: {
        top: "High Value Property",
        bottom: "Needs High Value Protection",
        topTextColor: "text-text-main",
        topBgColor: "bg-white",
        bottomTextColor: "text-text-main",
        bottomBgColor: "bg-brand-orange"
    },
    valueProp: {
        heading: "No questions-asked coverage <br/> up to <span class='font-zin-italic text-brand-orange'>₹1.5 lakh</span>",
        subtext: "Understand your rental cover",
        cta: "Request an Invite",
        lottie: "/lotties/coverage.json",
        themeColor: "orange"
    },
    getStarted: {
        heading: "Securing your rental income is simple",
        steps: [
            { id: "l_step1", title: "Request your invite", desc: "Share your property details", lottie: "/lotties/l_step1.png" },
            { id: "l_step2", title: "Verify Ownership", desc: "Complete simple KYC to verify ownership.", lottie: "/lotties/l_step2.png" },
            { id: "l_step3", title: "Invite Tenant", desc: "We onboard your tenant and set up payments.", lottie: "/lotties/l_step3.png" },
            { id: "l_step4", title: "Relax & Earn", desc: "Get paid on time, every time, even if vacancy happens.", lottie: "/lotties/l_step4.png" }
        ]
    },
    faqCategory: "landlord"
};
