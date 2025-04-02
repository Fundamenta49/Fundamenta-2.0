/**
 * Sample resume data for testing the Resume Builder component
 */

export const sampleResume = `
ALEX MORGAN
alex.morgan@example.com | (555) 123-4567 | San Francisco, CA

PROFESSIONAL SUMMARY
Dedicated and innovative Full Stack Developer with 5+ years of experience in designing, developing, and maintaining web applications using React, Node.js, and cloud technologies. Proven track record of delivering high-quality, scalable solutions that improve user experience and business efficiency. Passionate about clean code, agile methodologies, and continuous learning.

WORK EXPERIENCE
Senior Full Stack Developer
TechInnovate Solutions | San Francisco, CA | January 2020 - Present
• Led development of a customer portal that increased user engagement by 37% by implementing React hooks and context API
• Architected and deployed microservices using Node.js and Express, reducing API response times by 45%
• Mentored 4 junior developers, conducting code reviews and providing technical guidance
• Implemented CI/CD pipelines with GitHub Actions, reducing deployment time by 60%
• Collaborated with UX/UI team to redesign dashboard interface, increasing user satisfaction by 28%

Full Stack Developer
WebSphere Inc. | Oakland, CA | March 2018 - December 2019
• Developed responsive web applications using React, Redux, and TypeScript
• Built RESTful APIs using Node.js and MongoDB, supporting 10,000+ daily active users
• Implemented authentication system using JWT and OAuth2.0
• Optimized database queries, improving application performance by 30%
• Participated in agile development cycles, including sprint planning and retrospectives

Front-End Developer
CreativeTech Studios | San Jose, CA | June 2016 - February 2018
• Created interactive UI components with JavaScript, HTML5, and CSS3
• Collaborated with designers to implement pixel-perfect layouts
• Developed mobile-first responsive websites for various clients
• Optimized front-end performance through code splitting and lazy loading
• Integrated third-party APIs for payment processing and social media

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | 2012 - 2016
• GPA: 3.8/4.0
• Relevant coursework: Data Structures, Algorithms, Web Development, Database Systems

SKILLS
• Programming Languages: JavaScript (ES6+), TypeScript, Python, SQL
• Front-End: React, Redux, HTML5, CSS3, SASS, Tailwind CSS
• Back-End: Node.js, Express, MongoDB, PostgreSQL, RESTful APIs
• Tools: Git, Docker, AWS, Firebase, Jest, Webpack
• Methodologies: Agile, Scrum, Test-Driven Development

PROJECTS
E-Commerce Platform
• Built a full-stack e-commerce application using MERN stack
• Implemented features including user authentication, product catalog, and payment processing
• Utilized Redux for state management and MongoDB for data storage

Weather Dashboard
• Developed a weather application consuming OpenWeatherMap API
• Created responsive UI with React and implemented geolocation services
• Deployed on Netlify with automated CI/CD pipeline

CERTIFICATIONS
• AWS Certified Developer – Associate (2023)
• MongoDB Certified Developer (2022)
• React Advanced Patterns Certification (2021)
`;

export const sampleResumeStructured = {
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  phone: "(555) 123-4567",
  summary: "Dedicated and innovative Full Stack Developer with 5+ years of experience in designing, developing, and maintaining web applications using React, Node.js, and cloud technologies. Proven track record of delivering high-quality, scalable solutions that improve user experience and business efficiency. Passionate about clean code, agile methodologies, and continuous learning.",
  education: "Bachelor of Science in Computer Science\nUniversity of California, Berkeley | 2012 - 2016\n• GPA: 3.8/4.0\n• Relevant coursework: Data Structures, Algorithms, Web Development, Database Systems",
  experience: "Senior Full Stack Developer\nTechInnovate Solutions | San Francisco, CA | January 2020 - Present\n• Led development of a customer portal that increased user engagement by 37% by implementing React hooks and context API\n• Architected and deployed microservices using Node.js and Express, reducing API response times by 45%\n• Mentored 4 junior developers, conducting code reviews and providing technical guidance\n• Implemented CI/CD pipelines with GitHub Actions, reducing deployment time by 60%\n• Collaborated with UX/UI team to redesign dashboard interface, increasing user satisfaction by 28%\n\nFull Stack Developer\nWebSphere Inc. | Oakland, CA | March 2018 - December 2019\n• Developed responsive web applications using React, Redux, and TypeScript\n• Built RESTful APIs using Node.js and MongoDB, supporting 10,000+ daily active users\n• Implemented authentication system using JWT and OAuth2.0\n• Optimized database queries, improving application performance by 30%\n• Participated in agile development cycles, including sprint planning and retrospectives\n\nFront-End Developer\nCreativeTech Studios | San Jose, CA | June 2016 - February 2018\n• Created interactive UI components with JavaScript, HTML5, and CSS3\n• Collaborated with designers to implement pixel-perfect layouts\n• Developed mobile-first responsive websites for various clients\n• Optimized front-end performance through code splitting and lazy loading\n• Integrated third-party APIs for payment processing and social media",
  skills: "• Programming Languages: JavaScript (ES6+), TypeScript, Python, SQL\n• Front-End: React, Redux, HTML5, CSS3, SASS, Tailwind CSS\n• Back-End: Node.js, Express, MongoDB, PostgreSQL, RESTful APIs\n• Tools: Git, Docker, AWS, Firebase, Jest, Webpack\n• Methodologies: Agile, Scrum, Test-Driven Development",
  projects: "E-Commerce Platform\n• Built a full-stack e-commerce application using MERN stack\n• Implemented features including user authentication, product catalog, and payment processing\n• Utilized Redux for state management and MongoDB for data storage\n\nWeather Dashboard\n• Developed a weather application consuming OpenWeatherMap API\n• Created responsive UI with React and implemented geolocation services\n• Deployed on Netlify with automated CI/CD pipeline",
  certifications: "• AWS Certified Developer – Associate (2023)\n• MongoDB Certified Developer (2022)\n• React Advanced Patterns Certification (2021)",
  resumeText: ""
};

// Supply the raw text to the resumeText field
sampleResumeStructured.resumeText = sampleResume;

// Add sample job position for optimization
export const sampleJobPosition = {
  title: "Senior Frontend Developer",
  description: `
About the role:
We're looking for a talented Senior Frontend Developer to join our growing team. You'll be responsible for building modern, responsive web interfaces that provide exceptional user experiences. The ideal candidate has expert-level React skills and experience with modern frontend tooling.

Key responsibilities:
• Develop and maintain frontend applications using React, TypeScript, and modern JavaScript
• Collaborate with UX/UI designers to implement intuitive interfaces
• Optimize applications for maximum speed and scalability
• Write clean, maintainable code with comprehensive tests
• Participate in code reviews and provide constructive feedback
• Stay up-to-date with emerging trends and technologies

Requirements:
• 4+ years of professional experience in frontend development
• Expert-level knowledge of React, Redux, and TypeScript
• Strong understanding of responsive design principles
• Experience with modern build tools (Webpack, Vite)
• Proficiency in writing unit and integration tests
• Knowledge of CI/CD processes
• Experience with performance optimization techniques
• Excellent problem-solving and communication skills

Nice to have:
• Experience with Next.js or similar frameworks
• Knowledge of GraphQL
• Familiarity with SSR and SSG concepts
• Experience with micro-frontend architectures
• Contributions to open-source projects
`
};

export const sampleAnalysis = {
  strengths: [
    "Strong technical skill set covering both front-end and back-end technologies",
    "Quantified achievements with specific metrics (e.g., 37% increase in user engagement)",
    "Progressive career growth from Front-End to Senior Full Stack Developer",
    "Relevant certifications that validate expertise",
    "Clear demonstration of leadership and mentoring abilities"
  ],
  weaknesses: [
    "Summary could be more targeted toward specific roles or industries",
    "Limited information about soft skills and teamwork capabilities",
    "Project descriptions could include more details about specific technical challenges overcome",
    "Education section lacks information about relevant extracurricular activities or academic projects"
  ],
  suggestions: [
    "Tailor the resume summary to target specific roles when applying",
    "Add a section highlighting soft skills like communication and problem-solving",
    "Include more context about team sizes and project scopes in work experience",
    "Consider adding metrics to project outcomes to demonstrate impact",
    "Incorporate keywords from job descriptions to improve ATS matching"
  ]
};