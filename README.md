# AWS Infrastructure and React Playground

This repository serves as a technical sandbox for exploring Infrastructure as Code (IaC) via Terraform and modern frontend development with React. The project is currently hosted on AWS and managed through a robust CI/CD pipeline.



## Project Overview

The primary objective of this project is to practice professional cloud orchestration and full-stack integration. While the site currently hosts a collection of mini-games, it is actively evolving into a comprehensive professional portfolio.

### Current Features
* **Minesweeper:** A logic-based challenge focusing on complex state management in React.
* **Tic-Tac-Toe:** A classic implementation used to refine component logic and UI flow.
* **Infrastructure Management:** Fully automated deployment using Terraform.

---

## Technical Architecture

The environment is built on AWS using a modular approach to ensure scalability and security.

### Infrastructure (AWS & Terraform)
* **Amazon EC2:** Provisioned to handle application logic and potential backend services.
* **Amazon S3:** Utilised for storing static assets and web hosting.
* **Amazon DynamoDB:** A NoSQL database used for game data persistence and user records.
* **Terraform:** Defines the entire stack as code, ensuring environment consistency.

### Frontend (React)
* Developed using React with a focus on functional components and hooks.
* Managed via **npm** for dependency resolution and production builds.

### CI/CD (GitHub Actions)
* Automated workflows are triggered on every push to the main branch.
* The pipeline handles the building of the React application and synchronises changes with AWS.

---

## Getting Started

### Local Development
To run the React application locally, follow these steps:

1. Install dependencies: `npm install`
2. Start the development server: `npm start`
3. Build for production: `npm run build`

### Infrastructure Deployment
To modify or deploy the infrastructure:

1. Initialise the directory: `terraform init`
2. Review the execution plan: `terraform plan`
3. Apply changes: `terraform apply`

---

## Future Roadmap

The long-term vision for this repository includes the following milestones:
* Transitioning the landing page into a professional personal profile.
* Integrating DynamoDB more deeply to track global high scores for the games.
* Implementing advanced VPC configurations to enhance network security.

---

## Contact

If you have any questions regarding this project, feel free to reach out via GitHub Issues.