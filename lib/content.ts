/**
 * Single source of truth for every word on the site.
 *
 * Everything below is taken from Mellanda Kumalasari's CV and her portfolio PDF
 * (project pages, About page, achievement certificates). Wording is tightened for the
 * web, but no employment history, project outcome, metric, award or skill is invented.
 * Dates and employment types are reproduced exactly as documented (overlaps included).
 */

export const BUILD_YEAR = new Date().getFullYear();

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type PanelTone = "ink" | "aqua" | "paper" | "fjord" | "lagoon" | "seaglass";
export type PanelLayout = "wide" | "frame-right" | "frame-left" | "bleed-right" | "bleed-left";

export interface ProjectImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** CSS object-position for cropped presentations (defaults to the top-left of the page). */
  objectPosition?: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  /** Short domain label shown in the panel header. */
  domain: string;
  /** Full description, as in the portfolio PDF. */
  summary: string;
  /** One-to-two sentence version used on the stacked panel. */
  blurb: string;
  /** One line describing what I worked on (condensed from the PDF). */
  role: string;
  /** Every documented contribution (shown in the detail dialog). */
  contributions: string[];
  /** Technology labels exactly as listed in the portfolio PDF. */
  tech: string[];
  image: ProjectImage;
  tone: PanelTone;
  layout: PanelLayout;
}

export type TimelineKind = "employment" | "internship" | "education";

export interface ExperienceItem {
  id: string;
  kind: Exclude<TimelineKind, "education">;
  organization: string;
  location: string;
  role: string;
  employmentType: string;
  period: string;
  points: string[];
  tech: string[];
}

export interface EducationItem {
  id: string;
  kind: "education";
  organization: string;
  program: string;
  period: string;
  note?: string;
}

export interface Achievement {
  id: string;
  ordinal: string;
  place: string;
  /** Named award within the competition, when the certificate gives one. */
  award?: string;
  event: string;
  field: string;
  year: string;
  role: string;
  awarded: string;
  issuer?: string;
  certificate: { src: string; width: number; height: number; alt: string };
}

export interface SkillGroup {
  label: string;
  items: string[];
}

/** Text with optional highlighted phrases, used for editorial statements. */
export type RichSegment = string | { highlight: string };

/* -------------------------------------------------------------------------- */
/* Profile                                                                    */
/* -------------------------------------------------------------------------- */

export const profile = {
  name: "Mellanda Kumalasari",
  firstName: "Mellanda",
  lastName: "Kumalasari",
  role: "Backend Developer",
  roleLong: "Backend Developer with fullstack development experience",
  location: "Malang, Indonesia",
  email: "mellandakumalasari13@gmail.com",
  linkedin: "https://www.linkedin.com/in/mellanda-kumalasari/",
  linkedinHandle: "in/mellanda-kumalasari",
  current: "PT. Traspac Makmur Sejahtera",
  intro:
    "I build web applications and backend services with Golang, PHP and TypeScript: REST APIs, microservices, caching and asynchronous workflows. I also have frontend experience, so I understand how both sides come together to deliver complete features.",
  siteDescription:
    "Portfolio of Mellanda Kumalasari, a backend developer with fullstack experience: Golang microservices, Laravel and NestJS web platforms, and eight selected projects.",
};

export const navLinks = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

/** Technologies named in the CV and the portfolio PDF, used for the hero ticker. */
export const tickerItems = [
  "Golang",
  "PostgreSQL",
  "Redis",
  "RabbitMQ",
  "Microservices",
  "Laravel",
  "NestJS",
  "Next.js",
  "TypeScript",
  "PHP",
  "MySQL",
  "Docker",
];

/* -------------------------------------------------------------------------- */
/* About                                                                      */
/* -------------------------------------------------------------------------- */

export const aboutStatement: RichSegment[] = [
  "Backend developer with hands-on experience building web applications and backend services using ",
  { highlight: "Golang" },
  ", ",
  { highlight: "PHP" },
  ", and ",
  { highlight: "TypeScript" },
  ".",
];

export const aboutParagraphs: RichSegment[][] = [
  [
    "I work extensively with Golang, developing APIs and working with ",
    { highlight: "microservices-based systems" },
    ". I\u2019m comfortable with backend architecture, business logic, database design, service-to-service communication, and API integrations.",
  ],
  [
    "My experience also includes ",
    { highlight: "Laravel and NestJS" },
    ", as well as ",
    { highlight: "PostgreSQL and MySQL" },
    ". I\u2019ve worked on systems involving payment gateways, AI services, OCR, and network integrations.",
  ],
  [
    "Backend development is my main focus, but I also have frontend experience and understand how frontend and backend components come together to deliver complete features.",
  ],
];

export const aboutPullQuote =
  "I enjoy solving technical problems, understanding how systems work under the hood, and building software that is reliable, maintainable, and practical.";

export const portrait = {
  src: "/about/portrait.webp",
  width: 1400,
  height: 2100,
  alt: "Portrait of Mellanda Kumalasari smiling, seated at a table with warm pendant lamps behind her.",
};

export const aboutFacts: { label: string; value: string }[] = [
  { label: "Based in", value: "Malang, Indonesia" },
  { label: "Currently", value: "Backend Developer, PT. Traspac Makmur Sejahtera (Remote)" },
  { label: "Studying", value: "Information System, BINUS Online" },
  { label: "Languages", value: "Bahasa Indonesia (Native), English (B1)" },
  { label: "Certifications", value: "Basic Problem Solving, HackerRank (2024) \u00b7 TOEIC, International Test Center (2024)" },
];

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages & frameworks",
    items: [
      "Golang",
      "PHP",
      "TypeScript",
      "JavaScript",
      "Laravel",
      "NestJS",
      "Node.js",
      "Next.js",
      "Blade",
      "Tailwind CSS",
    ],
  },
  {
    label: "Data, messaging & tooling",
    items: ["PostgreSQL", "MySQL", "Redis", "RabbitMQ", "Docker", "Git", "Swagger"],
  },
  {
    label: "Architecture & practice",
    items: [
      "Microservices",
      "REST APIs",
      "RPC",
      "Clean Architecture",
      "JWT authentication",
      "Server-side rendering",
      "Service-to-service communication",
    ],
  },
  {
    label: "Integrations",
    items: [
      "Payment gateway (Midtrans)",
      "AI services (Gemini API, Pollinations.ai)",
      "OCR",
      "MikroTik API",
      "BSrE e-signing",
    ],
  },
];

/** Soft skills, as listed in the CV. */
export const softSkills = [
  "Teamwork",
  "Fast learning",
  "Leadership",
  "Good communication",
  "Adaptability",
  "Problem solving",
  "Critical thinking",
  "Initiative",
];

/** Words for the About section's scrolling type band: technologies named in the CV. */
export const aboutBand = {
  top: ["Backend", "Golang", "Microservices", "PHP", "TypeScript"],
  bottom: ["Laravel", "NestJS", "PostgreSQL", "Redis", "RabbitMQ"],
};

/* -------------------------------------------------------------------------- */
/* Projects  (shown most recent first; the PDF numbers them 01 to 08)        */
/* -------------------------------------------------------------------------- */

export const projects: Project[] = [
  {
    slug: "ilc-bkpm",
    title: "ILC-BKPM",
    subtitle: "Investment Learning Center",
    domain: "Digital learning platform",
    summary:
      "Investment Learning Center (ILC) is a digital learning platform developed for BKPM to support competency development through training and professional development programs.",
    blurb:
      "A digital learning platform for BKPM that supports competency development through training and professional development programs, built on Golang microservices.",
    role: "Backend services in Golang within a microservices architecture, with Redis, RabbitMQ and PostgreSQL.",
    contributions: [
      "Developed and maintained backend services using Golang within a microservices architecture.",
      "Developed and maintained features across multiple business domains, including Training, Internship, Coaching & Mentoring, and other learning-related modules.",
      "Worked with PostgreSQL for data management and relational data modeling.",
      "Integrated BSrE for electronic signing of generated certificates and digital documents.",
      "Implemented asynchronous job processing using queues for resource-intensive operations, including certificate generation for Internship, Coaching & Mentoring, and SIKU modules.",
      "Developed and maintained service-to-service integrations across the microservices ecosystem.",
      "Worked with Redis and RabbitMQ for caching and asynchronous message processing.",
      "Investigated and resolved bugs across different services and modules.",
      "Implemented new features and improvements based on evolving business requirements.",
      "Collaborated with frontend developers and other team members to ensure smooth end-to-end feature implementation.",
    ],
    tech: ["Golang", "PostgreSQL", "Redis", "RabbitMQ", "Microservices", "REST API", "RPC", "Svelte"],
    image: {
      src: "/projects/ilc-bkpm.webp",
      width: 1896,
      height: 897,
      alt: "Investment Learning Center landing page with a green hero carousel announcing structured, flexible, ready-to-use self-paced learning.",
      objectPosition: "50% 0%",
    },
    tone: "ink",
    layout: "wide",
  },
  {
    slug: "pos-website",
    title: "POS Website",
    subtitle: "Web-Based Point of Sale System",
    domain: "Point of sale",
    summary:
      "A web-based point-of-sale system designed to support modern cashier operations. It handles more than just transactions: it connects ordering, payment, inventory, employee attendance, and transaction history into one platform.",
    blurb:
      "A point-of-sale system that connects ordering, payment, inventory, employee attendance and transaction history into one platform.",
    role: "NestJS and TypeScript backend, Midtrans payments, OCR-assisted ordering and inventory.",
    contributions: [
      "Developed backend services using NestJS and TypeScript.",
      "Built API communication between the backend and the Next.js frontend.",
      "Integrated Midtrans for payment processing.",
      "Implemented manual menu ordering.",
      "Integrated OCR for automated menu ordering.",
      "Built inventory management connected to sales transactions.",
      "Developed transaction history and filtering features.",
      "Worked on employee attendance functionality.",
      "Supported reporting features for transaction data.",
    ],
    tech: ["NestJS", "Next.js", "Midtrans API", "OCR Integration", "PostgreSQL", "TypeScript", "JavaScript"],
    image: {
      src: "/projects/pos.webp",
      width: 1920,
      height: 1080,
      alt: "Restaurant point-of-sale ordering screen with a search bar, menu categories, a promotion banner and discounted dishes.",
    },
    tone: "aqua",
    layout: "frame-right",
  },
  {
    slug: "yummo",
    title: "Yummo",
    subtitle: "AI-Powered Recipe Recommendation Website",
    domain: "Recipe recommendation",
    summary:
      "Yummo is a recipe recommendation platform that generates personalized recipe ideas based on factors such as mood, weather, available ingredients, and user conditions. The application uses AI to make recommendations more personalized instead of simply showing a fixed list of recipes.",
    blurb:
      "A recipe website that uses AI to suggest personalized recipes from mood, weather, available ingredients and user conditions.",
    role: "NestJS backend and Next.js frontend, with Gemini-powered recipe recommendations.",
    contributions: [
      "Developed backend services using NestJS and TypeScript.",
      "Built the frontend using Next.js.",
      "Integrated Gemini API for AI-powered recipe recommendations.",
      "Implemented ingredient-based recipe input.",
      "Built the flow for generating personalized recipe recommendations.",
      "Integrated Pollinations.ai to automatically generate recipe images.",
      "Worked with PostgreSQL for application data.",
    ],
    tech: ["NestJS", "Next.js", "Gemini API", "Pollinations.ai API", "PostgreSQL", "TypeScript"],
    image: {
      src: "/projects/yummo.webp",
      width: 1920,
      height: 1080,
      alt: "Yummo landing page inviting visitors to find cooking inspiration, with a button to start creating a recipe.",
    },
    tone: "paper",
    layout: "frame-left",
  },
  {
    slug: "smkn-8-malang",
    title: "SMKN 8 Malang",
    subtitle: "School Profile Website",
    domain: "School profile",
    summary:
      "A school profile website created to provide information about SMKN 8 Malang. The website consists of a public-facing landing page and an admin panel that allows administrators to manage the content displayed on the website.",
    blurb:
      "A school profile website with a public landing page and an admin panel for managing the content shown on the site.",
    role: "Led the development team; NestJS backend and APIs for the Next.js frontend.",
    contributions: [
      "Led the development team throughout the project.",
      "Coordinated development tasks and guided the team in implementing project requirements.",
      "Defined technical approaches and development standards for the project.",
      "Reviewed code and provided feedback to maintain code quality and consistency.",
      "Developed backend services using NestJS and TypeScript.",
      "Designed and implemented APIs to connect the backend with the Next.js frontend.",
      "Worked with PostgreSQL for application data.",
      "Developed the admin-side content management flow.",
      "Helped ensure smooth integration between frontend and backend.",
    ],
    tech: ["NestJS", "Next.js", "Axios", "PostgreSQL", "TypeScript"],
    image: {
      src: "/projects/smkn8.webp",
      width: 2400,
      height: 1350,
      alt: "SMKN 8 Malang website hero with a photo of the school building, the school name and a search field.",
      objectPosition: "18% 50%",
    },
    tone: "fjord",
    layout: "bleed-right",
  },
  {
    slug: "wedvite",
    title: "Wedvite",
    subtitle: "Digital Wedding Invitation Platform",
    domain: "Digital invitations",
    summary:
      "Wedvite is a platform for creating customizable digital wedding invitations. Users can choose from available templates and personalize their invitations with custom text, backgrounds, music, characters, and other content. The platform also includes AI-powered message generation, guest RSVP functionality, and integrated online payments.",
    blurb:
      "A platform for customizable digital wedding invitations, with AI message generation, guest RSVP and online payments.",
    role: "Set coding standards and reviewed pull requests; Laravel backend features.",
    contributions: [
      "Defined and maintained coding standards and development practices across the project.",
      "Reviewed code changes and approved pull requests before they were merged.",
      "Provided technical direction and guidance to other developers throughout the development process, including the AI-powered message generation and guest RSVP features.",
      "Helped ensure code quality, consistency, maintainability, and adherence to project standards.",
      "Developed backend features using Laravel and PHP.",
      "Built customization features for invitation backgrounds, music, and RSVP characters.",
    ],
    tech: ["Blade", "Laravel", "MySQL", "HTML", "CSS", "JavaScript", "Midtrans API", "PHP"],
    image: {
      src: "/projects/wedvite.webp",
      width: 2400,
      height: 1350,
      alt: "Wedvite landing page with an illustration of a bride and groom and the headline Platform Wedding E-invitation.",
    },
    tone: "lagoon",
    layout: "frame-left",
  },
  {
    slug: "rn-billing-service",
    title: "RN Billing Service",
    subtitle: "MikroTik Billing & RADIUS Management System",
    domain: "Billing & RADIUS",
    summary:
      "RN Billing Service is a web-based billing and RADIUS management system built to support MikroTik PPPoE and Hotspot environments. The system is designed for businesses such as ISPs, RTRWNet providers, and hotspot operators that need centralized customer and billing management.",
    blurb:
      "A web-based billing and RADIUS system for MikroTik PPPoE and Hotspot environments, made for ISPs, RTRWNet providers and hotspot operators.",
    role: "Billing and customer-management features, MikroTik API integration and MySQL.",
    contributions: [
      "Developed web-based billing and customer management features.",
      "Integrated the application with MikroTik API.",
      "Worked with MySQL to manage centralized application data.",
      "Supported automated billing workflows.",
      "Built features for managing customers and network-related data.",
      "Developed the system to be accessible across different platforms.",
    ],
    tech: ["MikroTik API", "MySQL", "HTML", "CSS", "JavaScript", "PHP"],
    image: {
      src: "/projects/rn-billing.webp",
      width: 1280,
      height: 720,
      alt: "RN Billing Service landing page for MikroTik PPPoE and Hotspot billing, with an isometric illustration of servers and monitors.",
      objectPosition: "50% 0%",
    },
    tone: "seaglass",
    layout: "wide",
  },
  {
    slug: "unikos",
    title: "UniKos",
    subtitle: "Boarding House Booking Platform",
    domain: "Boarding house booking",
    summary:
      "UniKos is a web-based platform for finding and booking boarding houses online. The platform supports multiple boarding-house owners, allowing them to manage their properties and tenants. Users can register as either tenants or property owners, while administrators have a dedicated panel to manage the platform.",
    blurb:
      "A web platform for finding and booking boarding houses online, with tenant, owner and administrator roles.",
    role: "Led the development team; Laravel and Blade frontend and backend features.",
    contributions: [
      "Led the development team and coordinated the implementation of project features.",
      "Planned and distributed development tasks based on project requirements.",
      "Developed both frontend and backend features using Laravel, Blade, PHP, and MySQL.",
      "Implemented booking flows between tenants and property owners.",
      "Built property and tenant management features.",
      "Implemented user roles and their respective workflows.",
      "Reviewed development progress and helped resolve technical issues throughout the project.",
    ],
    tech: ["Blade", "MySQL", "Laravel", "PHP"],
    image: {
      src: "/projects/unikos.webp",
      width: 1890,
      height: 1017,
      alt: "UniKos landing page welcoming visitors with a 3D illustration of two apartment buildings.",
    },
    tone: "ink",
    layout: "frame-right",
  },
  {
    slug: "simas",
    title: "SIMAS",
    subtitle: "School Administration Management System",
    domain: "School administration",
    summary:
      "SIMAS is a web-based school administration system designed to simplify administrative processes within a school. The application helps manage different aspects of school administration, including financial information and student data, through a centralized system.",
    blurb:
      "A web-based school administration system that centralizes administrative processes, including financial information and student data.",
    role: "PHP and JavaScript application with a MySQL database and administrative features.",
    contributions: [
      "Developed the web application using PHP and JavaScript.",
      "Built and managed the MySQL database.",
      "Developed administrative features for managing school data.",
      "Worked across backend and frontend components to support the application flow.",
      "Focused on creating straightforward workflows that make administrative tasks easier to manage.",
    ],
    tech: ["HTML", "CSS", "MySQL", "JavaScript", "PHP"],
    image: {
      src: "/projects/simas.webp",
      width: 2400,
      height: 1350,
      alt: "SIMAS admin dashboard with summary cards for students, teachers and employees and an organization structure table.",
      objectPosition: "0% 0%",
    },
    tone: "lagoon",
    layout: "bleed-left",
  },
];

/* -------------------------------------------------------------------------- */
/* Experience & education  (CV order: most recent first)                      */
/* -------------------------------------------------------------------------- */

export const experience: ExperienceItem[] = [
  {
    id: "traspac",
    kind: "employment",
    organization: "PT. Traspac Makmur Sejahtera",
    location: "Central Jakarta",
    role: "Backend Developer",
    employmentType: "Full-time (Remote)",
    period: "May 2025 \u2013 Present",
    points: [
      "Analyzed business and product requirements for the BKPM Investment Learning Center (ILC) platform, translating them into API contracts, data flows, and service interactions.",
      "Designed and developed scalable REST APIs using Golang within a microservices architecture, focusing on clean code and maintainable service structures.",
      "Utilized Redis for caching and performance optimization, reducing redundant database queries and improving API response performance.",
      "Integrated RabbitMQ for asynchronous communication and background processing between microservices, including certificate generation workflows.",
      "Worked with PostgreSQL across multiple BKPM platform features, applying Clean Architecture principles and consistent coding practices.",
    ],
    tech: ["Golang", "Microservices", "REST APIs", "Redis", "RabbitMQ", "PostgreSQL", "Clean Architecture"],
  },
  {
    id: "paperplay",
    kind: "internship",
    organization: "Paperplay Studio",
    location: "Malang",
    role: "Fullstack Developer",
    employmentType: "Internship",
    period: "Jun 2024 \u2013 Apr 2025",
    points: [
      "Led a small team of developers to ensure timely project delivery and efficient task distribution across sprints.",
      "Developed fullstack web applications using Laravel, NestJS, Next.js, and PostgreSQL, with responsive UI components styled in Tailwind CSS.",
      "Built and documented RESTful APIs using Swagger, and implemented Server-Side Rendering in Next.js to improve page load times and SEO.",
      "Mentored junior developers in backend concepts, Git workflows, and code quality best practices during the Wedvite project.",
      "Containerized multiple applications with Docker for consistent development environments and simplified deployment.",
    ],
    tech: ["Laravel", "NestJS", "Next.js", "PostgreSQL", "Tailwind CSS", "Swagger", "Docker"],
  },
  {
    id: "unimasoft",
    kind: "internship",
    organization: "Unimasoft.id",
    location: "Malang",
    role: "Backend & Fullstack Developer",
    employmentType: "Internship",
    period: "Jun 2023 \u2013 Jul 2024",
    points: [
      "Led a small team through an entire project lifecycle, from initial planning and client requirement gathering to deployment and post-launch support.",
      "Designed robust backend systems using PHP, Laravel, and MySQL, focusing on scalability and maintainability.",
      "Built secure authentication and authorization systems using JWT, and created clean, reusable APIs to support frontend integration.",
      "Developed an admin dashboard interface and took part in daily stand-ups, sprint reviews, and code reviews.",
    ],
    tech: ["PHP", "Laravel", "MySQL", "JWT", "Git"],
  },
  {
    id: "tiga-pilar-garuda",
    kind: "internship",
    organization: "PT. Tiga Pilar Garuda",
    location: "Malang",
    role: "Backend Developer",
    employmentType: "Internship",
    period: "Mar 2023 \u2013 Jun 2023",
    points: [
      "Supported the development of scalable backend features using PHP, MySQL, Node.js, and JavaScript.",
      "Implemented server-side logic and structured database queries to ensure application efficiency and data consistency.",
      "Utilized AJAX for asynchronous data fetching to improve frontend responsiveness without full-page reloads.",
      "Worked closely with frontend teams on API integration and feature testing, with debugging, performance monitoring, and issue resolution.",
    ],
    tech: ["PHP", "MySQL", "Node.js", "JavaScript", "AJAX", "Git"],
  },
];

export const education: EducationItem[] = [
  {
    id: "binus",
    kind: "education",
    organization: "BINUS Online",
    program: "Undergraduate \u2013 Information System",
    period: "May 2026 \u2013 Present",
  },
  {
    id: "smkn4",
    kind: "education",
    organization: "SMK Negeri 4 Malang",
    program: "Software Engineering",
    period: "Jun 2022 \u2013 Jun 2025",
    note: "Activities and societies: Pustakawan Remaja. Developed communication, reading passion, and social skills, and strengthened teamwork and time management through organizing and assisting library activities.",
  },
];

/* -------------------------------------------------------------------------- */
/* Achievements                                                               */
/* -------------------------------------------------------------------------- */

export const achievements: Achievement[] = [
  {
    id: "jti-play-it",
    ordinal: "1st",
    place: "1st Place",
    award: "Best Content",
    event: "JTI Play IT Competition 2024",
    field: "Web Development",
    year: "2024",
    role: "Team of three, contributed as Backend Developer",
    awarded: "Certificate dated Malang, 3 November 2024",
    issuer: "Held by the Information Technology Department, Politeknik Negeri Malang",
    certificate: {
      src: "/achievements/jti-play-it-2024.webp",
      width: 1600,
      height: 1132,
      alt: "Certificate for 1st place, Best Content, Website Development category, at the JTI Play IT 2024 national competition.",
    },
  },
  {
    id: "traspac",
    ordinal: "3rd",
    place: "3rd Place",
    event: "Traspac IT Competition 2025",
    field: "Web/Mobile Apps",
    year: "2025",
    role: "Solo project as Full Stack Developer",
    awarded: "Certificate dated Jakarta, 24 February 2025",
    certificate: {
      src: "/achievements/traspac-2025.webp",
      width: 1600,
      height: 1131,
      alt: "Certificate for 3rd place in the Web/Mobile Apps category of the Traspac IT Competition 2025.",
    },
  },
];
