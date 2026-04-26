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
    id: "aiml",
    slug: "ai-ml-data-science",
    title: "AI / ML & Data Science",
    description: "Learn to build intelligent systems and data-driven models with our exclusive early bird offer.",
    longDescription: "Step into the future with our AI/ML program. We take you from basic Python programming to building and deploying complex neural networks. This course is perfect for those who love math, logic, and data. Take advantage of our early bird offer today!",
    icon: BrainCircuit,
    color: "text-purple-600",
    bg: "bg-purple-50",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop",
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
    price: 14500,
    faq: [
      { q: "Do I need to be a math genius?", a: "No, we teach the necessary math (Linear Algebra, Stats) as we go along." },
      { q: "Which tools will I learn?", a: "Python, Jupyter, Scikit-learn, Pandas, and more." }
    ]
  },
  {
    id: "cyber",
    slug: "cyber-security-ethical-hacking",
    title: "Cyber Security",
    description: "Protect digital assets and learn ethical hacking techniques with our early bird offer.",
    longDescription: "In an increasingly digital world, security is paramount. Our Cyber Security course trains you to think like a hacker to protect systems better. From network security to penetration testing, you'll learn it all. Secure your spot now with our early bird offer!",
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
    price: 14500,
    faq: [
      { q: "Is this course legal?", a: "Yes, we teach Ethical Hacking for defensive purposes only. All labs are sandboxed." },
      { q: "Do I need a high-end PC?", a: "A standard PC with 8GB RAM is sufficient to run virtual labs." }
    ]
  }
];
