import { applicationOperator } from "@/content/application";

// Public page copy. Keep presentation in components and preserve approved wording.
export const faqCopy = {
  title: "Frequently Asked",
  titleHighlight: "Questions",
  separatorAlt: "Caution",
  items: [
    {
      question: "Is The Maximal Template™ a joke?",
      answer: "Of course.\nSo is your corporate culture.",
    },
    {
      question: "Is The Maximal Template™ open source?",
      answer:
        "Only to people who finally discover what it feels like to ship exactly what they wanted without apologizing.",
    },
    {
      question: "Is this AI psychosis?",
      answer: "No.\nIt’s Vibe Coding.",
    },
  ],
} as const;

export const termsCopy = {
  title: "Terms of",
  titleHighlight: "Service",
  separatorAlt: "Caution",
  updatedAt: "September 4, 2026",
  updatedAtDateTime: "2026-09-04",
  updatedAtLabel: "Last updated:",
  introduction: `These Terms of Service govern your use of The Maximal Template™ website and hosted application operated by ${applicationOperator.name}. By using the site or application, you agree to these Terms.`,

  sections: [
    {
      id: "terms-1",
      title: "1. About The Maximal Template™",
      content:
        "The Maximal Template™ is a personal, experimental, educational, and open-source software project demonstrating application architecture, integrations, development practices, and related technologies. It is not a guaranteed production service, professional service, financial product, or substitute for professional advice.",
    },
    {
      id: "terms-2",
      title: "2. Accounts",
      content:
        "Some features require authentication through a third-party identity provider. You are responsible for activity associated with your account and for keeping your credentials secure. You may not access another person's account, workspace, records, or application data without authorization.",
    },
    {
      id: "terms-3",
      title: "3. Acceptable Use",
      content:
        "You may not use the website or application to violate applicable law, disrupt the application or its infrastructure, bypass authentication, authorization, or security controls, access systems or data you are not authorized to access, distribute malware or intentionally harmful code, probe or exploit security vulnerabilities without authorization, or abuse automated interfaces or infrastructure in a way that materially disrupts the service or other users.",
    },
    {
      id: "terms-4",
      title: "4. Open-Source Software",
      content: `Portions of The Maximal Template™ are available under the open-source license included with the source-code repository. That license governs your rights to copy, modify, distribute, and use the source code. These Terms govern use of the hosted website and application and do not replace or modify the applicable open-source license. The Maximal Template™, ${applicationOperator.name}, and related names, logos, and marks may be protected separately from the source-code license.`,
    },
    {
      id: "terms-5",
      title: "5. Third-Party Services",
      content: `The application may rely on third-party services for authentication, hosting, databases, storage, deployment, communications, artificial intelligence, and other integrations. Your use of those services may also be subject to their own terms and privacy policies. ${applicationOperator.name} is not responsible for third-party services it does not control.`,
    },
    {
      id: "terms-6",
      title: "6. Availability and Changes",
      content:
        "The Maximal Template™ is an evolving software project. Features, data, interfaces, and functionality may be added, changed, removed, reset, renamed, redeployed, or discontinued without notice. Continuous availability, preservation of application data, backward compatibility, and any particular service level are not guaranteed. Do not store information in the application that you cannot afford to lose.",
    },
    {
      id: "terms-7",
      title: "7. Security",
      content:
        "The application may use reasonable technical safeguards, including authentication, authorization, database controls, encrypted network connections, and other security measures. No software system can guarantee absolute security. You are responsible for deciding whether the project is suitable for your intended use.",
    },
    {
      id: "terms-8",
      title: "8. No Warranty",
      content: `THE WEBSITE, APPLICATION, SOURCE CODE, AND RELATED MATERIALS ARE PROVIDED "AS IS" AND "AS AVAILABLE." TO THE MAXIMUM EXTENT PERMITTED BY LAW, ${applicationOperator.name.toUpperCase()} DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, ACCURACY, RELIABILITY, SECURITY, AND AVAILABILITY. USE THE PROJECT AT YOUR OWN RISK.`,
    },
    {
      id: "terms-9",
      title: "9. Limitation of Liability",
      content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, ${applicationOperator.name.toUpperCase()} WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOSS OF DATA, REVENUE, PROFITS, BUSINESS OPPORTUNITIES, OR GOODWILL ARISING FROM OR RELATED TO USE OF THE WEBSITE, APPLICATION, OR SOFTWARE. Nothing in these Terms limits liability that cannot legally be limited or excluded.`,
    },
    {
      id: "terms-10",
      title: "10. Suspension or Termination",
      content: `${applicationOperator.name} may restrict or terminate access to the hosted application when reasonably necessary to protect the application, its users, third parties, or infrastructure, respond to abuse or security threats, comply with legal obligations, or address material violations of these Terms. You may stop using the application at any time.`,
    },
    {
      id: "terms-11",
      title: "11. Changes to These Terms",
      content:
        "These Terms may be updated as the project changes. The date shown on this page identifies the current version. Continued use of the website or application after an update constitutes acceptance of the revised Terms to the extent permitted by applicable law.",
    },
    {
      id: "terms-12",
      title: "12. Contact",
      content: `Questions about these Terms may be sent to ${applicationOperator.name} at ${applicationOperator.email}.`,
    },
  ],
} as const;

export const privacyCopy = {
  title: "Privacy",
  titleHighlight: "Policy",
  separatorAlt: "Caution",
  updatedAt: "September 4, 2026",
  updatedAtDateTime: "2026-09-04",
  updatedAtLabel: "Last updated:",
  introduction: `This Privacy Policy explains how ${applicationOperator.name} handles information in connection with The Maximal Template™ website and application.`,

  sections: [
    {
      id: "privacy-1",
      title: "1. Information We May Process",
      content: `The information processed by the application depends on how you use it. If you create or use an authenticated account, the application may process information such as your username, email address, display name, profile image, authentication identifiers, account information, and session information. Authentication is provided through Clerk, and ${applicationOperator.name} does not receive or store your account password when authentication is handled directly by Clerk. Authenticated features may also store information you intentionally create, submit, edit, upload, or otherwise provide, with the exact application data depending on the features and domain capabilities being used. Hosting, authentication, database, security, and infrastructure providers may also process technical information such as IP addresses, browser and device information, request timestamps, requested URLs, authentication and session metadata, diagnostic information, security events, and error logs as necessary to operate, secure, troubleshoot, and maintain the application. Because The Maximal Template™ is an experimental and evolving project, application data should not be treated as permanent archival storage.`,
    },
    {
      id: "privacy-2",
      title: "2. How Information Is Used",
      content:
        "Information may be used to authenticate users, maintain application sessions, authorize access to protected functionality, associate application records with the appropriate user or workspace, provide requested application functionality, process user-created records, detect abuse or security problems, investigate errors, maintain system integrity, and operate and improve the project.",
    },
    {
      id: "privacy-3",
      title: "3. Service Providers",
      content:
        "The application relies on third-party infrastructure providers that may process information on our behalf. Clerk provides authentication and identity infrastructure and may process information required for account creation, authentication, sessions, and related identity functionality. Neon provides PostgreSQL database infrastructure and may store application records, account references, workspace data, and related information. Vercel may provide hosting, build, deployment, and network infrastructure and may process technical request, deployment, security, and diagnostic information associated with operating the application. The Maximal Template™ may also contain optional integrations with additional providers, which process information only when configured and used. If an integration materially changes how personal information is processed, this policy may be updated accordingly.",
    },
    {
      id: "privacy-4",
      title: "4. Cookies and Authentication Technologies",
      content:
        "The application and its authentication provider may use cookies, browser storage, or similar technologies for authentication, session management, security, fraud prevention, and protected application functionality. These technologies may be required for authenticated portions of the application to work.",
    },
    {
      id: "privacy-5",
      title: "5. Sharing of Information",
      content: `${applicationOperator.name} does not sell personal information. Information may be disclosed to service providers necessary to operate the application, when required by applicable law or valid legal process, when reasonably necessary to investigate fraud, abuse, security incidents, or threats, when necessary to protect the rights, property, or safety of ${applicationOperator.name}, users, or third parties, or in connection with a transfer of the project or its assets if such a transfer occurs.`,
    },
    {
      id: "privacy-6",
      title: "6. Data Retention",
      content:
        "Information is retained only for as long as reasonably necessary for the operation, development, security, maintenance, or legal obligations of the project. Because The Maximal Template™ is an experimental project, development databases and application records may occasionally be reset, recreated, or deleted. Do not rely on the application as your only copy of important information.",
    },
    {
      id: "privacy-7",
      title: "7. Security",
      content:
        "Reasonable technical measures may be used to protect application information, including authentication controls, authorization boundaries, tenant isolation, database access controls, row-level security, validated server-side operations, encrypted network connections, and signed webhook verification. No application, network, or storage system can guarantee absolute security.",
    },
    {
      id: "privacy-8",
      title: "8. Your Choices",
      content:
        "Depending on the information involved and applicable law, you may request access to, correction of, or deletion of personal information. Requests may be sent to the contact address below. Some information may remain in security logs, backups, audit records, or other systems where retention is reasonably necessary or legally required.",
    },
    {
      id: "privacy-9",
      title: "9. Children's Privacy",
      content: `The Maximal Template™ is not specifically directed to children. ${applicationOperator.name} does not knowingly operate the project for the purpose of collecting personal information from children. If you believe personal information belonging to a child has been submitted improperly, contact us so the issue can be reviewed.`,
    },
    {
      id: "privacy-10",
      title: "10. External Links",
      content: `The website may contain links to source-code repositories, third-party websites, provider documentation, and external services. ${applicationOperator.name} is not responsible for the privacy practices of websites or services it does not control.`,
    },
    {
      id: "privacy-11",
      title: "11. Changes to This Policy",
      content:
        "This Privacy Policy may be updated as the application, infrastructure, or integrations change. The date shown on this page identifies the current version.",
    },
    {
      id: "privacy-12",
      title: "12. Contact",
      content: `Questions or requests concerning this Privacy Policy may be sent to ${applicationOperator.name} at ${applicationOperator.email}.`,
    },
  ],
} as const;

export const landingCopy = {
  title: "The Maximal Template™",
  titleHighlight: "Domain Library",
  description: {
    tagline: "Maximum SaaS Per Token",
    lines: ["Because productivity is dead.", "Long live product."],
  },
  pipelineTitle: "The Maximal Template™ Pipeline",
  testimonialsTitle: "Early Adopter Results",
  testimonials: [
    {
      quote: "None of the code lands but it still gets merged.",
      author: "Senior Engineer",
      role: "",
    },
    {
      quote: "My manager says my PR's are hard to read.",

      author: "Product Designer",
      role: "",
    },
    {
      quote: "I don’t argue anymore. I deploy.",
      author: "Founder",
      role: "",
    },
  ],
  ctaTitle: "The Maximal Template™\nDomain Library",
  ctaDescription: "Ship less code\nMove more product",
  primaryAction: { label: "GET STARTED", href: "/sign-up" },
  secondaryAction: { label: "LEARN MORE", href: "/#features" },
  separatorAlt: "Caution",
  integrationsAlt: "Integrations",
} as const;
export const pipelineCards = [
  {
    title: "Intent Ingestion",
    content: "You don’t think about the specifications. You compress them.",
  },
  {
    title: "Scope Laundering",
    content:
      "We remove obvious slop and replace it with “interesting implementations.”",
  },
  {
    title: "System Thinning",
    content:
      "Why use twelve competing ontologies when four can govern with the same level of provenance and surgical grace?",
  },
  {
    title: "Vibes Amplification Layer",
    content:
      "The same codebase now passes CI and deploys. This is called enterprise readiness.",
  },
  {
    title: "Codependent Compatibility",
    content:
      "If the deployment cannot survive emotional collapse, it is rolled back.",
  },
  {
    title: "Plausible Deniability",
    content: "Ship the artifact. Let the commit history explain itself.",
  },
] as const;
