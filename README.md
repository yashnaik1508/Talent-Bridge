🚀 TalentBridge – Skill-Based Employee–Project Matching System

TalentBridge is a Spring Boot–based application designed to intelligently match employees to projects based on skills, experience, and availability. It also provides project tracking through module completion, enabling better workforce utilization and project visibility in IT organizations.

🔧 Tech Stack

- Java 21
- Spring Boot
- Spring Security (JWT Authentication)
- Maven
- JPA / Hibernate
- MySQL
- Eclipse IDE

📂 Project Structure

src/main/java
└── com.talentbridge
    ├── config          # Security, JWT & datasource configuration
    ├── controller      # REST APIs
    ├── dao             # Data access interfaces
    ├── dao.impl        # DAO implementations
    ├── exception       # Custom exceptions
    ├── model           # Entity & DTO classes
    ├── service         # Business logic interfaces
    ├── service.impl    # Service implementations
    └── util            # Utility classes (JWT, password, paging)

🧩 Core Modules

- Employee & Skill Management
- Project & Skill Requirement Management
- Employee–Project Matching Engine
- Assignment & Ranking System
- Project Progress Tracking (Module-wise)
- User Authentication & Authorization (JWT)

🤖 Matching Logic
Matching Score = (Skill Match × 0.6) + (Experience Match × 0.3) + (Availability × 0.1)

🔐 Security

- JWT-based authentication
- Role-based access control
- Secure password handling

📊 Key Features

- Automated employee recommendations
- Score-based ranking (out of 100)
- Admin override for final assignments
- Project creation with module completion tracking
- Centralized staffing & progress dashboard

🎯 Use Cases

- IT Companies
- Consulting Firms
- HR Tech Platforms

▶️ How to Run

- Clone the repository
- Configure database in application.properties
- Run the Spring Boot application
- Access APIs via Postman or frontend
📌 Outcome

TalentBridge improves project staffing accuracy, reduces skill mismatch, and enhances project delivery efficiency through intelligent automation and managerial control.

- Author : Yash Naik