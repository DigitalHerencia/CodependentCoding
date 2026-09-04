import { Mail, MessageSquareText } from "lucide-react";

import { ContactWithCards } from "@/components/blocks/contact-section";

export default function Page() {
  return (
    <ContactWithCards
      title="Talk through your application shape"
      description="Choose a direct channel; no inert contact form or fake submission path."
      contactMethods={[
        {
          icon: <Mail className="size-6" />,
          title: "Email",
          description: "Send product and implementation questions.",
          action: { label: "Write an email", href: "mailto:hello@example.com" },
        },
        {
          icon: <MessageSquareText className="size-6" />,
          title: "Application demo",
          description:
            "Inspect a concrete recipe before choosing a configuration.",
          action: { label: "Explore dashboard", href: "/dashboard" },
        },
      ]}
    />
  );
}
