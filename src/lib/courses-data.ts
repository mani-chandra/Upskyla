import { 
  Code2, 
  BrainCircuit, 
  ShieldAlert, 
  CloudCog, 
  Clock, 
  Calendar, 
  Video, 
  Trophy, 
  Users2, 
  Rocket,
  CheckCircle2,
  BookOpen,
  Terminal,
  Layers,
  Cpu,
  ShieldCheck,
  Server,
  Workflow
} from "lucide-react";

export interface CurriculumModule {
  title: string;
  hours: number;
  topics: string[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  icon: any;
  color: string;
  bg: string;
  duration: string;
  totalHours: number;
  format: string;
  highlights: string[];
  outcomes: string[];
  curriculum: CurriculumModule[];
  capstone: {
    description: string;
    requirements: string[];
    timeline: { week: string; task: string }[];
  };
  price: number;
  faq: { q: string; a: string }[];
  image: string;
  curriculumPdf?: string;
}

export const courses: Course[] = [
  {
    id: "fsd",
    slug: "full-stack-development",
    title: "Full Stack Development",
    description: "Master the art of building complete web applications from scratch.",
    longDescription: "Our Full Stack Development program is designed to transform you into a job-ready engineer. We cover everything from pixel-perfect UI with React to robust backend systems with Node.js and PostgreSQL. Even if you've never written a line of code, our structured approach ensures you master the fundamentals before moving to complex architecture.",
    icon: Code2,
    color: "text-blue-600",
    bg: "bg-blue-50",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
    curriculumPdf: "/docs/curriculum/full-stack-web.pdf",
    duration: "4 Months",
    totalHours: 96,
    format: "Weekend Only (Sat & Sun) - Live Online",
    highlights: ["MERN/PERN Stack", "Real-world Projects", "Code Reviews", "Interview Prep"],
    outcomes: ["Build scalable web apps", "Master Frontend & Backend", "Version Control expert", "Job Ready Portfolio"],
    curriculum: [
      { title: "HTML, CSS & Responsive Design", hours: 15, topics: ["Semantic HTML", "CSS Flexbox & Grid", "Responsive Design", "Tailwind CSS"] },
      { title: "JavaScript Mastery", hours: 15, topics: ["DOM Manipulation", "ES6+ Syntax", "Async/Await", "API Integration"] },
      { title: "Git & GitHub", hours: 5, topics: ["Version Control", "Branching Strategies", "Pull Requests", "Open Source Basics"] },
      { title: "React Frontend", hours: 15, topics: ["Hooks (State, Effect)", "Context API", "React Router", "Component Architecture"] },
      { title: "Backend Architecture", hours: 15, topics: ["Express.js", "REST APIs", "Middleware", "JWT Auth"] },
      { title: "Databases", hours: 10, topics: ["PostgreSQL/MongoDB", "CRUD Operations", "Schema Design", "Indexing"] },
      { title: "DSA for Interviews", hours: 10, topics: ["Arrays & Strings", "Recursion", "Sorting Algorithms", "Interview Logic"] },
      { title: "Final Project Build", hours: 7, topics: ["Full Stack Integration", "Security Best Practices", "Performance Optimization"] },
      { title: "Deployment & Portfolio", hours: 4, topics: ["CI/CD Basics", "Vercel/AWS Deployment", "Resume Building", "GitHub Optimization"] }
    ],
    capstone: {
      description: "Build a production-grade full-stack application of your choice. From ideation to deployment, you'll be mentored throughout the process.",
      requirements: ["Mandatory Authentication", "Database Integration", "Responsive UI", "Public Deployment"],
      timeline: [
        { week: "Week 8", task: "Idea & Tech Stack Approval" },
        { week: "Week 10", task: "Database Schema & Architecture Review" },
        { week: "Week 12", task: "Core Development Phase" },
        { week: "Week 14", task: "Integration & Testing" },
        { week: "Week 16", task: "Final Deployment & Demo" }
      ]
    },
    price: 24999,
    faq: [
      { q: "Is this beginner friendly?", a: "Yes, we start from absolute basics of HTML and move to advanced concepts." },
      { q: "Do I need prior coding knowledge?", a: "No prior knowledge is required, just a laptop and a desire to learn." },
      { q: "Will I get a certificate?", a: "Yes, upon successful completion of the course and capstone project." },
      { q: "Is placement guaranteed?", a: "We provide 100% placement assistance, including mock interviews and resume building." }
    ]
  },
  {
    id: "aiml",
    slug: "ai-ml-data-science",
    title: "AI / ML & Data Science",
    description: "Learn to build intelligent systems and data-driven models.",
    longDescription: "Step into the future with our AI/ML program. We take you from basic Python programming to building and deploying complex neural networks. This course is perfect for those who love math, logic, and data.",
    icon: BrainCircuit,
    color: "text-purple-600",
    bg: "bg-purple-50",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop",
    curriculumPdf: "/docs/curriculum/ai-ml.pdf",
    duration: "4 Months",
    totalHours: 96,
    format: "Weekend Only (Sat & Sun) - Live Online",
    highlights: ["Python Mastery", "Deep Learning Basics", "Real Datasets", "Cloud Deployment"],
    outcomes: ["Build Predictive Models", "Data Visualization expert", "AI App Deployment", "Mathematical Intuition"],
    curriculum: [
      { title: "Python for Data Science", hours: 15, topics: ["Python Basics", "OOPs in Python", "File Handling", "Exception Handling"] },
      { title: "Data Analysis Libraries", hours: 15, topics: ["NumPy for Math", "Pandas for Dataframes", "Data Cleaning", "Preprocessing"] },
      { title: "Data Visualization", hours: 10, topics: ["Matplotlib", "Seaborn", "Storytelling with Data"] },
      { title: "Machine Learning (Supervised)", hours: 15, topics: ["Linear/Logistic Regression", "Decision Trees", "Random Forest", "SVM"] },
      { title: "Machine Learning (Unsupervised)", hours: 10, topics: ["K-Means Clustering", "PCA", "Association Rules"] },
      { title: "Model Evaluation & Tuning", hours: 10, topics: ["Hyperparameter Tuning", "Cross Validation", "Confusion Matrix"] },
      { title: "Neural Networks Intro", hours: 10, topics: ["Perceptrons", "Backpropagation", "Deep Learning Intro"] },
      { title: "Deployment (Streamlit/API)", hours: 11, topics: ["Streamlit Dashboards", "Flask/FastAPI for Models", "Cloud Basics"] }
    ],
    capstone: {
      description: "Develop an AI-powered solution using real-world datasets. Focus on solving a specific business or social problem.",
      requirements: ["Clean Dataset Pipeline", "Multiple Model Comparison", "Interactive Dashboard", "Model Deployment"],
      timeline: [
        { week: "Week 8", task: "Dataset Selection & Problem Statement" },
        { week: "Week 10", task: "Exploratory Data Analysis (EDA)" },
        { week: "Week 12", task: "Model Training & Optimization" },
        { week: "Week 14", task: "Dashboard/API Development" },
        { week: "Week 16", task: "Deployment & Presentation" }
      ]
    },
    price: 29999,
    faq: [
      { q: "Do I need to be a math genius?", a: "No, we teach the necessary math (Linear Algebra, Stats) as we go along." },
      { q: "Which tools will I learn?", a: "Python, Jupyter, Scikit-learn, Pandas, and more." }
    ]
  },
  {
    id: "cyber",
    slug: "cyber-security-ethical-hacking",
    title: "Cyber Security",
    description: "Protect digital assets and learn ethical hacking techniques.",
    longDescription: "In an increasingly digital world, security is paramount. Our Cyber Security course trains you to think like a hacker to protect systems better. From network security to penetration testing, you'll learn it all.",
    icon: ShieldAlert,
    color: "text-red-600",
    bg: "bg-red-50",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    curriculumPdf: "/docs/curriculum/cyber-security.pdf",
    duration: "4 Months",
    totalHours: 96,
    format: "Weekend Only (Sat & Sun) - Live Online",
    highlights: ["Hands-on Labs", "Vulnerability Research", "Security Auditing", "CTF Challenges"],
    outcomes: ["Security Auditor", "Penetration Tester", "Network Defender", "Bug Bounty Basics"],
    curriculum: [
      { title: "Networking Fundamentals", hours: 15, topics: ["OSI Model", "TCP/IP", "Subnetting", "DNS/HTTP Protocols"] },
      { title: "Linux for Hackers", hours: 15, topics: ["Bash Scripting", "User Management", "Permissions", "Networking Tools"] },
      { title: "Information Gathering", hours: 10, topics: ["Nmap", "Whois", "Shodan", "Social Engineering Basics"] },
      { title: "Vulnerability Analysis", hours: 15, topics: ["Nessus", "Burp Suite Intro", "Metasploit", "Exploit Search"] },
      { title: "Web Security (OWASP Top 10)", hours: 15, topics: ["SQL Injection", "XSS", "CSRF", "Auth Bypassing"] },
      { title: "Network Hacking", hours: 10, topics: ["WiFi Hacking", "Man-in-the-Middle", "Packet Sniffing"] },
      { title: "Reporting & Compliance", hours: 6, topics: ["Audit Reporting", "Compliance Basics", "Ethics in Hacking"] },
      { title: "Capstone: Security Audit", hours: 10, topics: ["End-to-end VAPT", "Final Report Generation"] }
    ],
    capstone: {
      description: "Perform a complete Vulnerability Assessment and Penetration Test (VAPT) on a target environment and provide a professional audit report.",
      requirements: ["Vulnerability Scan", "Manual Exploitation", "Remediation Steps", "Professional Report"],
      timeline: [
        { week: "Week 8", task: "Target Selection & Scope" },
        { week: "Week 10", task: "Reconnaissance Phase" },
        { week: "Week 12", task: "Vulnerability Assessment" },
        { week: "Week 14", task: "Exploitation & PoC" },
        { week: "Week 16", task: "Final Audit Report & Demo" }
      ]
    },
    price: 27999,
    faq: [
      { q: "Is this course legal?", a: "Yes, we teach Ethical Hacking for defensive purposes only. All labs are sandboxed." },
      { q: "Do I need a high-end PC?", a: "A standard PC with 8GB RAM is sufficient to run virtual labs." }
    ]
  },
  {
    id: "devops",
    slug: "cloud-computing-devops",
    title: "Cloud & DevOps",
    description: "Bridge the gap between development and operations with modern tools.",
    longDescription: "Master the tools that power modern software delivery. Our Cloud & DevOps course focuses on automation, scalability, and the cloud-native ecosystem. Learn to deploy applications like a pro.",
    icon: CloudCog,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=2070&auto=format&fit=crop",
    curriculumPdf: "/docs/curriculum/devops.pdf",
    duration: "4 Months",
    totalHours: 96,
    format: "Weekend Only (Sat & Sun) - Live Online",
    highlights: ["AWS Cloud", "Docker & K8s", "CI/CD Automation", "Infrastructure as Code"],
    outcomes: ["Cloud Architect", "DevOps Engineer", "Automation Specialist", "SRE Basics"],
    curriculum: [
      { title: "Linux & Shell Scripting", hours: 15, topics: ["Linux Internals", "Automating Tasks", "System Administration"] },
      { title: "Git & Advanced Workflow", hours: 5, topics: ["GitFlow", "Hooks", "Multi-repo management"] },
      { title: "Containerization (Docker)", hours: 15, topics: ["Docker Architecture", "Writing Dockerfiles", "Docker Compose", "Registry"] },
      { title: "Cloud Fundamentals (AWS)", hours: 15, topics: ["EC2, S3, RDS", "IAM & Security", "VPC Networking"] },
      { title: "CI/CD Pipelines", hours: 15, topics: ["Jenkins/GitHub Actions", "Build Automation", "Testing in Pipeline"] },
      { title: "Infrastructure as Code", hours: 10, topics: ["Terraform Basics", "Ansible Configuration", "Provisioning"] },
      { title: "Orchestration (Kubernetes)", hours: 15, topics: ["K8s Clusters", "Pods, Services, Deployments", "Helm Charts"] },
      { title: "Monitoring & Logging", hours: 6, topics: ["Prometheus/Grafana", "ELK Stack Basics", "Site Reliability"] }
    ],
    capstone: {
      description: "Design and implement a highly available, automated deployment pipeline for a multi-service application on a public cloud platform.",
      requirements: ["Full CI/CD Pipeline", "Container Orchestration", "Infrastructure as Code", "Monitoring Setup"],
      timeline: [
        { week: "Week 8", task: "Architecture & Tooling Strategy" },
        { week: "Week 10", task: "Base Infrastructure Setup (IaC)" },
        { week: "Week 12", task: "CI/CD & Containerization" },
        { week: "Week 14", task: "Scale & Reliability Testing" },
        { week: "Week 16", task: "Final Demo & Handover" }
      ]
    },
    price: 32999,
    faq: [
      { q: "Is AWS certification included?", a: "The course prepares you for AWS Solutions Architect Associate, but exam fees are separate." },
      { q: "Do I need to be a developer?", a: "Basic coding knowledge is helpful, but we focus on scripting and automation." }
    ]
  }
];
