import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const items = [
    {
        id: "1",
        title: "New Delhi",
        content:
            "I’m Ali Imam — a designer and creative developer focused on building digital experiences that are minimal, meaningful, and timeless.",
    },
    {
        id: "2",
        title: "Hyderabad",
        content:
            "I create clean, functional interfaces, brand systems, and digital products. My work blends simplicity with clarity and usability.",
    },
    {
        id: "3",
        title: "Chennai",
        content:
            "For me, design isn’t just visuals — it’s how something feels and works. I focus on clarity, detail, and storytelling in every project.",
    },
    {
        id: "4",
        title: "Pune",
        content:
            "I bridge design and development, turning ideas into interactive experiences with modern tools and technology.",
    },
    {
        id: "5",
        title: "Mumbai",
        content:
            "Minimalism, architecture, and everyday details. I believe great design is found in the small things we often overlook.",
    },
];

export function Accordion05() {
    return (
        <div className="w-full max-w-3xl mx-auto">
            <Accordion type="single" defaultValue="5" collapsible className="w-full">
                {items.map((item) => (
                    <AccordionItem value={item.id} key={item.id} className="last:border-b">
                        <AccordionTrigger className="text-left pl-6 md:pl-14 overflow-hidden text-foreground/20 duration-200 hover:no-underline cursor-pointer -space-y-6 data-[state=open]:space-y-0 data-[state=open]:text-primary [&>svg]:hidden">
                            <div className="flex flex-1 items-start gap-4">
                                <p className="text-xs">{item.id}</p>
                                <h2
                                    className={`uppercase relative text-center text-xl md:text-3xl font-medium`}
                                >
                                    {item.title}
                                </h2>
                            </div>
                        </AccordionTrigger>

                        <AccordionContent className="text-muted-foreground pb-6 pl-6 md:px-20">
                            {item.content}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
