const LLMOutput = `
**Month 1**

* Week 1:
    * Introduction to HTML and CSS
    * Syntax, elements, attributes, tags
* Week 2:
    * Advanced HTML and CSS
    * Layouts, selectors, positioning
* Week 3:
    * JavaScript Fundamentals
    * Variables, data types, operators
* Week 4:
    * Introduction to ReactJS
    * Components, state management

**Project: Static web page with responsive design using HTML, CSS, and basic JavaScript**

**Month 2**

* Week 1:
    * Intermediate ReactJS
    * Hooks, class components
* Week 2:
    * Redux and State Management
    * Managing and manipulating application state
* Week 3:
    * NodeJS for Backend Development
    * Request handling, middleware
* Week 4:
    * MongoDB for Database Management
    * Document-oriented database, CRUD operations

**Project: Dynamic web application with ReactJS, Redux, NodeJS, and MongoDB**

**Month 3**

* Week 1:
    * Advanced Web Development Techniques
    * Optimization, accessibility, security
* Week 2:
    * Cloud Deployment and Hosting
    * AWS, Azure, or Google Cloud
* Week 3:
    * Continuous Integration and Delivery
    * CI/CD pipelines, version control
* Week 4:
    * Capstone Project
    * Design and develop a comprehensive web application that leverages the skills and technologies learned

**Project: Scalable and secure web application with modern development practices**
`;

const parseLLM = (input) => {
  const lines = input.trim().split("\n");
  const result = {};
  let currentMonth = "";
  let currentWeek = "";
  let currentProject = "";
  lines.forEach((line) => {
    line = line.trim();
    line = line.replace(/[^\w\s]/g, "");
    if (line.startsWith("Month")) {
      currentMonth = line.replace(/\*\*/g, "").trim();
      result[currentMonth] = { weeks: {}, project: "" };
    } else if (line.startsWith("Week")) {
      currentWeek = line.replace(/\*/g, "").trim();
      result[currentMonth].weeks[currentWeek] = [];
    } else if (line.startsWith("Project:")) {
      currentProject = line.replace(/\*\*/g, "").trim();
      result[currentMonth].project = currentProject;
    } else if (line.startsWith("")) {
      result[currentMonth].weeks[currentWeek].push(line.trim());
    }
  });
};

const parseLLMOutput = parseLLM(LLMOutput);
const LLMobj = JSON.stringify(parseLLMOutput, null, 2);
