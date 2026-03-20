# projet42

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=com.projet42:projet42&metric=alert_status)](https://sonarcloud.io/dashboard?id=com.projet42:projet42)

This project, `projet42`, integrates SonarQube for continuous code quality analysis. The Quality Gate status displayed above provides a quick overview of the project's quality, directly linked to its dashboard on SonarCloud.

## Introduction

This is a boilerplate project, generated with JHipster, aiming to showcase best practices in modern application development, including robust code quality analysis.

## Development

### Prerequisites

You will need the following to run and develop this application:

- [Node.js](https://nodejs.org/) (version 16 or newer)
- [Java Development Kit (JDK)](https://www.oracle.com/java/technologies/downloads/) (version 17 or newer)
- [Maven](https://maven.apache.org/) (version 3.8.x or newer)

### Running the application locally

To run the backend:

bash
./mvnw


To run the frontend (if applicable, assuming Angular):

bash
npm start


Or, to run both with JHipster dev profile:

bash
./mvnw -Pdev,webpack


## SonarQube Analysis

Code quality is paramount in `projet42`. SonarQube is integrated to enforce coding standards, identify bugs, vulnerabilities, and code smells.

### Running a local SonarQube scan

To perform an analysis and send the results to a SonarQube server (e.g., SonarCloud), use the following Maven command:

bash
./mvnw clean verify sonar:sonar


Ensure your `sonar-project.properties` file is correctly configured for your SonarQube instance and authentication tokens are set up in your Maven `settings.xml` or environment variables if needed.

## Building for Production

To build the application for production:

bash
./mvnw -Pprod clean verify


This will create a `target/*.jar` file that can be deployed.

## Further Information

For more details on JHipster, refer to its [official documentation](https://www.jhipster.tech/documentation/).