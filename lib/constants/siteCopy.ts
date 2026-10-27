// Public page copy for the factory site. Wording comes from the owner-approved
// template copy (template/content) and the original public copy; preserve it.

export const siteOperator = {
  name: "Digital Herencia",
  site: "The Codependent Coding™ Web App Architecture",
  issuesUrl: "https://github.com/DigitalHerencia/CodependentCoding/issues",
  securityUrl:
    "https://github.com/DigitalHerencia/CodependentCoding/security/policy",
} as const;

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
};

export type LegalDocument = {
  kicker: string;
  title: string;
  subtitle: string;
  updatedAt: string;
  updatedAtDateTime: string;
  introduction: string;
  sections: readonly LegalSection[];
};

export const faqCopy = {
  kicker: "The",
  title: "Frequently Asked Questions",
  subtitle: "Answered once. Regretted forever.",
  items: [
    {
      question: "Is The Maximal Template™ a joke?",
      answer: ["Of course.", "So is your corporate culture."],
    },
    {
      question: "Is The Maximal Template™ open source?",
      answer: [
        "Only to people who finally discover what it feels like to ship exactly what they wanted without apologizing.",
      ],
    },
    {
      question: "Is this AI psychosis?",
      answer: [
        "No.",
        "It’s controlled Vibe Coding under professional supervision.",
        "Completely different framework.",
      ],
    },
    {
      question: "What is Codependent Coding™, exactly?",
      answer: [
        "A software factory with one employee: a doctrine, The Maximal Template™, the Hipster Stack™ CLI, and the Loaded Vibes™ plugin.",
        "No parallel architecture. No nine starter repos drifting quietly toward entropy. One source implementation.",
      ],
    },
    {
      question: "Do I need an account?",
      answer: [
        "No. This site has no login, no database and no opinion about you.",
        "Nothing to borrow. We checked.",
      ],
    },
    {
      question: "Why does everything have a ™?",
      answer: ["Provenance is latency. Trademarks are cheaper than tests."],
    },
  ],
} as const;

export const securityCopy = {
  kicker: "On security",
  title: "We take security very seriously.",
  lines: [
    "Our policies do not put users' data at risk.",
    "Their PII already got leaked... just not by us.",
  ],
} as const;

export const termsCopy: LegalDocument = {
  kicker: "The",
  title: "Terms of Service",
  subtitle: "Read them. Nobody else did.",
  updatedAt: "October 26, 2026",
  updatedAtDateTime: "2026-10-26",
  introduction: `These Terms of Service govern your use of ${siteOperator.site} website operated by ${siteOperator.name}. By using the site, you agree to these Terms.`,
  sections: [
    {
      id: "terms-1",
      title: "1. About Codependent Coding™",
      paragraphs: [
        "Codependent Coding™ is a personal, experimental, educational, and open-source software project demonstrating application architecture, development practices, and related technologies: the doctrine, The Maximal Template™, the Hipster Stack™ CLI, and the Loaded Vibes™ plugin. It is not a guaranteed production service, professional service, financial product, or substitute for professional advice.",
      ],
    },
    {
      id: "terms-2",
      title: "2. No Accounts",
      paragraphs: [
        "This website has no accounts, sign-in, or user-submitted data. Applications you generate from The Maximal Template™ run on your own machine and your own provider accounts, under your own responsibility.",
      ],
    },
    {
      id: "terms-3",
      title: "3. Acceptable Use",
      paragraphs: [
        "You may not use the website to violate applicable law, disrupt the website or its infrastructure, bypass security controls, distribute malware or intentionally harmful code, probe or exploit security vulnerabilities without authorization, or abuse automated access in a way that materially disrupts the service.",
      ],
    },
    {
      id: "terms-4",
      title: "4. Open-Source Software",
      paragraphs: [
        `The source code is available under the license included with the repository. That license governs your rights to copy, modify, distribute, and use the source code. These Terms govern use of the website and do not replace or modify that license. Codependent Coding™, The Maximal Template™, Hipster Stack™, Loaded Vibes™, ${siteOperator.name}, and related names, logos, and marks may be protected separately from the source-code license.`,
      ],
    },
    {
      id: "terms-5",
      title: "5. Third-Party Services",
      paragraphs: [
        `The website is hosted by a third party and links to third-party services such as GitHub. Your use of those services is subject to their own terms and privacy policies. ${siteOperator.name} is not responsible for third-party services it does not control.`,
      ],
    },
    {
      id: "terms-6",
      title: "6. Availability and Changes",
      paragraphs: [
        "Codependent Coding™ is an evolving software project. Pages, features, commands, and content may be added, changed, removed, renamed, redeployed, or discontinued without notice. Continuous availability, backward compatibility, and any particular service level are not guaranteed.",
      ],
    },
    {
      id: "terms-7",
      title: "7. Copied Commands and Code",
      paragraphs: [
        "Commands, snippets, and source files shown on this website are provided for convenience. Read them before you run them. You are responsible for what you paste into your terminal, and for the consequences of shipping it.",
      ],
    },
    {
      id: "terms-8",
      title: "8. No Warranty",
      paragraphs: [
        `THE WEBSITE, SOURCE CODE, AND RELATED MATERIALS ARE PROVIDED "AS IS" AND "AS AVAILABLE." TO THE MAXIMUM EXTENT PERMITTED BY LAW, ${siteOperator.name.toUpperCase()} DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, ACCURACY, RELIABILITY, SECURITY, AND AVAILABILITY. USE THE PROJECT AT YOUR OWN RISK.`,
      ],
    },
    {
      id: "terms-9",
      title: "9. Limitation of Liability",
      paragraphs: [
        `TO THE MAXIMUM EXTENT PERMITTED BY LAW, ${siteOperator.name.toUpperCase()} WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOSS OF DATA, REVENUE, PROFITS, BUSINESS OPPORTUNITIES, OR GOODWILL ARISING FROM OR RELATED TO USE OF THE WEBSITE OR SOFTWARE. Nothing in these Terms limits liability that cannot legally be limited or excluded.`,
      ],
    },
    {
      id: "terms-10",
      title: "10. Changes to These Terms",
      paragraphs: [
        "These Terms may be updated as the project changes. The date shown on this page identifies the current version. Continued use of the website after an update constitutes acceptance of the revised Terms to the extent permitted by applicable law.",
      ],
    },
    {
      id: "terms-11",
      title: "11. Contact",
      paragraphs: [
        `Questions about these Terms may be sent to ${siteOperator.name} by opening an issue on the project's GitHub repository.`,
      ],
    },
  ],
};

export const privacyCopy: LegalDocument = {
  kicker: "The",
  title: "Privacy Policy",
  subtitle: "Short, because we collect nothing.",
  updatedAt: "October 26, 2026",
  updatedAtDateTime: "2026-10-26",
  introduction: `This Privacy Policy explains how ${siteOperator.name} handles information in connection with ${siteOperator.site} website.`,
  sections: [
    {
      id: "privacy-1",
      title: "1. Information We Collect",
      paragraphs: [
        "None, on purpose. The website is static: no accounts, no forms that submit anywhere, no database, no analytics, and no advertising. Generated commands and copied snippets stay in your browser and your clipboard.",
      ],
    },
    {
      id: "privacy-2",
      title: "2. Hosting Logs",
      paragraphs: [
        "The hosting provider may process technical information such as IP addresses, browser and device information, request timestamps, requested URLs, and error logs as necessary to deliver, secure, and troubleshoot the website. That processing is governed by the hosting provider's own privacy policy.",
      ],
    },
    {
      id: "privacy-3",
      title: "3. Cookies",
      paragraphs: [
        "The website does not set cookies for tracking or advertising. Your browser may cache pages and assets to load them faster.",
      ],
    },
    {
      id: "privacy-4",
      title: "4. Sharing of Information",
      paragraphs: [
        `${siteOperator.name} does not sell personal information. There is nothing to sell. We checked.`,
      ],
    },
    {
      id: "privacy-5",
      title: "5. Apps You Generate",
      paragraphs: [
        "Applications generated from The Maximal Template™ ship with their own privacy policy template. You operate those applications, choose their providers, and are responsible for their privacy practices.",
      ],
    },
    {
      id: "privacy-6",
      title: "6. Children's Privacy",
      paragraphs: [
        `The website is not directed to children, and ${siteOperator.name} does not knowingly collect personal information from anyone, children included.`,
      ],
    },
    {
      id: "privacy-7",
      title: "7. External Links",
      paragraphs: [
        `The website links to source-code repositories, provider documentation, and external services. ${siteOperator.name} is not responsible for the privacy practices of websites or services it does not control.`,
      ],
    },
    {
      id: "privacy-8",
      title: "8. Changes to This Policy",
      paragraphs: [
        "This Privacy Policy may be updated as the website changes. The date shown on this page identifies the current version.",
      ],
    },
    {
      id: "privacy-9",
      title: "9. Contact",
      paragraphs: [
        `Questions about this Privacy Policy may be sent to ${siteOperator.name} by opening an issue on the project's GitHub repository. Report security problems privately through the repository's security policy, not in a public issue.`,
      ],
    },
  ],
};

export const comingSoonCopy = {
  maximal: {
    title: "The Maximal Template™",
    subtitle: "The template source, in Monaco",
    line: "Build maximal. Select deliberately. Delete aggressively. Browsing comes first.",
  },
  hipsterStack: {
    title: "Hipster Stack™",
    subtitle: "The CLI command builder",
    line: "Formerly The Anthimeria™ Workbench, now with 100% fewer servers.",
  },
  loadedVibes: {
    title: "Loaded Vibes™",
    subtitle: "The Claude Code plugin",
    line: "Controlled Vibe Coding under professional supervision. Install instructions incoming.",
  },
} as const;
