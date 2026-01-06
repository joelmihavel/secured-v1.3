
export const TENANT_CONTENT = {
    hero: {
        heading: "Earn <span class='relative inline-block px-1 font-zin-italic'>1% back<svg class='absolute bottom-1 left-0 w-full h-3 text-brand-orange -z-10' viewBox='0 0 100 10' preserveAspectRatio='none'><path d='M0 5 Q 50 10 100 5' stroke='currentColor' stroke-width='12' opacity='0.6' /></svg></span>",
        subheading: "On every timely <span class='font-zin-italic'>rent payment</span>",
        subtext: "Because habits like yours should be rewarded, not overlooked.",
        cta: "Request an Invite",
        tagline: "This isn't for average renters, really..",
        lottie: "/secure-lotties/Fold1/tenantfold.json",
        themeColor: "orange",
        layoutReverse: false
    },
    rentReward: {
        eyebrow: "RENT IS YOUR BIGGEST <span class='relative inline-block'>MONTHLY<img src='/secure-lotties/scribble_underline.svg' class='absolute -bottom-1 left-0 w-full' alt='' /></span> COMMITMENT.",
        heading: "You've handled it responsibly,<br/>but it's <span class='relative inline-block px-5 py-1'><span class='absolute inset-0 bg-pastel-orange rounded-full transform -rotate-1'></span><span class='relative font-zin-italic'>never really led to anything</span></span>",
        subtext: "Secured changes that with a simple cashback today, and ultimately opens doors to renting benefits that you truly deserve.",
        features: [
            { icon: "credit_card", title: "1% Cashback on Timely Rental Payment", comingSoon: false },
            { icon: "trophy", title: "First Dibs on Upcoming Flent Homes", comingSoon: true },
            { icon: "check_circle", title: "Zero Security Deposits", comingSoon: false },
            { icon: "design_services", title: "Home Design @ Zero Service Fee", comingSoon: true }
        ],
        lottie: "/secure-lotties/Fold2/tenant_fold_2.json"
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
        heading: "Yes, you can pay rent<br/>using your credit card here",
        subtext: "And yes, you still earn 1% back",
        cta: "Request an Invite",
        ctaTagline: "Compliant with RBI Guidelines | No Workarounds",
        lottie: "/secure-lotties/Fold3/tenantfold3.json",
        cards: [
            {
                title: "One-Time Setup, Lightning Fast Payments",
                icon: "/secure-lotties/ValuePropIcons/tenant_flash.png",
                isFocus: false
            },
            {
                title: "Collect points on rent every payment",
                icon: "/secure-lotties/ValuePropIcons/tenant_rupee.png",
                isFocus: false
            },
            {
                title: "Get upto 45 days of interest-free breathing room",
                icon: "/secure-lotties/ValuePropIcons/tenant_intrest_free.png",
                isFocus: true
            },
            {
                title: "Industry low net effective convenience fee of 0.85%*",
                icon: "/secure-lotties/ValuePropIcons/tenant_lowconveniencefee.png",
                isFocus: true
            }
        ]
    },
    getStarted: {
        eyebrow: "How does it work?",
        heading: "Getting started is simple<br/><span class='font-zin-italic'>& straightforward</span>",
        steps: [
            { id: "step1", icon: "mail", title: "Request your invite", desc: "Share your address, rent amount, & phone number", image: "/secure-lotties/GetStarted/tenant1.png" },
            { id: "step2", icon: "user-check", title: "Complete your KYC, & invite your landlord", desc: "We handle the rest", image: "/secure-lotties/GetStarted/tenant2.png" },
            { id: "step3", icon: "shield-check", title: "Landlord accepts and gets insured.", desc: "A free ₹1.5 lakh rental cover activates instantly.", image: "/secure-lotties/GetStarted/tenant3.png" },
            { id: "step4", icon: "coin", title: "Pay rent as usual, earn 1% back.", desc: "Every timely payment unlocks more rewards.", image: "/secure-lotties/GetStarted/tenant4.png" }
        ]
    },
    faqCategory: "tenant"
};

export const LANDLORD_CONTENT = {
    hero: {
        heading: "You get <span class='relative inline-block px-1 font-zin-italic'>Paid<svg class='absolute bottom-1 left-0 w-full h-3 text-brand-orange -z-10' viewBox='0 0 100 10' preserveAspectRatio='none'><path d='M0 5 Q 50 10 100 5' stroke='currentColor' stroke-width='12' opacity='0.6' /></svg></span>",
        subheading: "even after your <span class='font-zin-italic'>tenants vacate</span>",
        subtext: "Protect your rental income from empty months and sudden exits - free of cost.",
        cta: "Secure my Rental Income",
        tagline: "Free Forever | ₹1.5 lakh protection limit | Instant, hassle-free payout",
        lottie: "/secure-lotties/Fold1/landlordfold.json",
        themeColor: "orange",
        layoutReverse: true
    },
    rentReward: {
        eyebrow: "YOU INVESTED <span class='relative inline-block'>CRORES<img src='/secure-lotties/scribble_underline.svg' class='absolute -bottom-1 left-0 w-full' alt='' /></span> INTO THAT HOME",
        heading: "Yet, your rental income is just<br/><span class='relative inline-block px-5 py-1'><span class='absolute inset-0 bg-pastel-orange rounded-full transform -rotate-1'></span><span class='relative font-zin-italic'>one event away</span></span> from disruption",
        subtext: "Secured is a protection stack built around your rental asset. It starts with vacancy cover today and expands into smarter tools that future-proof your rental income for whatever comes next.",
        features: [
            { icon: "credit_card", title: "Zero-Cost Vacancy Cover", comingSoon: false },
            { icon: "trophy", title: "Zero-cost tenant background verification", comingSoon: false },
            { icon: "check_circle", title: "Loan Against Rental Income", comingSoon: false },
            { icon: "design_services", title: "Property Damage Cover", comingSoon: false }
        ],
        lottie: "/secure-lotties/Fold2/landlordFold2.json"
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
        heading: "Tenant or Not. Get paid on time,<br/>every month.",
        subtext: "No questions-asked coverage up to ₹1.5 lakh",
        cta: "Request an Invite",
        ctaTagline: "Simple | Compliant | No Workarounds",
        lottie: "/secure-lotties/Fold3/landlordfold3.json",
        cards: [
            {
                title: "Complimentary tenant credit report",
                icon: "/secure-lotties/ValuePropIcons/landlord_complimentary.png",
                isFocus: false
            },
            {
                title: "If the tenant leaves, you can collect one month's rent if the home is vacant for 30 days.",
                icon: "/secure-lotties/ValuePropIcons/landlord_tenantleavesrent.png",
                isFocus: true
            },
            {
                title: "If a tenant leaves without notice, you can collect up to one month's rent after adjusting the deposit.",
                icon: "/secure-lotties/ValuePropIcons/landlord_tenant_leaves.png",
                isFocus: true
            },
            {
                title: "Instant payouts, zero paperwork",
                icon: "/secure-lotties/ValuePropIcons/landlord_timer.png",
                isFocus: false
            },
            {
                title: "Simple, one-click signup",
                icon: "/secure-lotties/ValuePropIcons/landlord_simple_oneclick.png",
                isFocus: false
            },
            {
                title: "Complimentary tenant BGV report",
                icon: "/secure-lotties/ValuePropIcons/landlord_revs.png",
                isFocus: false
            }
        ]
    },
    getStarted: {
        eyebrow: "How does it work?",
        heading: "Setup Your Cover<br/><span class='font-zin-italic'>in <5 Minutes</span>",
        steps: [
            { id: "l_step1", icon: "file-text", title: "Request your invite and upload your existing rental contract", desc: "for property verification", image: "/secure-lotties/GetStarted/landlord1.png" },
            { id: "l_step2", icon: "home", title: "We approve your property", desc: "if you're eligible", image: "/secure-lotties/GetStarted/landlord2.png" },
            { id: "l_step3", icon: "users", title: "Invite your tenants and collect rent as usual.", desc: "Your tenants get 1% back on each rent payment.", image: "/secure-lotties/GetStarted/landlord3.png" },
            { id: "l_step4", icon: "shield-check", title: "Collect three consistent rent payments", desc: "to activate your insurance.", image: "/secure-lotties/GetStarted/landlord4.png" }
        ]
    },
    faqCategory: "landlord"
};
