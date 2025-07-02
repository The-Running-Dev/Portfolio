
# Backend


## C# / .NET

- **[AliaSQL](https://github.com/The-Running-Dev/Database-AliaSQL)**  
  Open source project I contributed to. AliaSQL was aimed at providing versioning for database deployments.

- **[Business Intelligence](https://github.com/The-Running-Dev/Contec-BusinessIntelligence)**  
  I spent 6 months evaluating BI tools to help the company analyse the vast amount of data they collected. This project is the web interface I created to expose the data charted through PowerBI.

- **[Code Generator](https://github.com/The-Running-Dev/Tools-CodeGenerator)**  
  This project uses Razor as the template engine, and given source templates, and access to the source database, generates the needed classes to implement the desired pattern. Context: I introduced a team I worked with to Dapper (a micro ORM), and over time I saw a need to generate a lot of classes based in the repository pattern I implemented in Dapper.

- **[Image Event Processor](https://github.com/The-Running-Dev/Demo-ImageEventProcessor)**  
  An .NET WebAPI hosted in AWS Lambda, with an Angular UI, as a demo for processing images.

- **[Menu Creator](https://github.com/The-Running-Dev/Demo-MenuCreator)**  
  A simple menu creator on top of .NET Core 2.2. This application is a coding exercise I was given and expected to complete in 60 minutes. The README in the repository documents the structure and implementation.

- **[OctopusDeploy-CruiseControlTray](https://github.com/The-Running-Dev/OctopusDeploy-CruiseControlTray)**  
  I am a CI/CD fanatic! There is a tool called CruiseControlTray initially implemented to be used with CruiseControl.NET. The tool can speak the status of the build based on accessing XML API available in CruiseControl.NET. While at MxToolbox, we had 50 inch TVs in every room, and the shared dev office had 4! This project translated the OctopusDeploy build status in the XML format that CruiseControlTray understood. That way we would get audio and video notifications of the deployment status.

- **[PatientViewer.NET](https://github.com/The-Running-Dev/Demo-PatientVIewer.NET)**  
  A project to showcase my .NET skills. It's a simple ASP.NET MVC/WebAPI application that displays a list of patients. The README in the repository documents the structure and implementation.

- **[Refactoring Exercise](https://github.com/The-Running-Dev/Demo-RefactoringExercise)**  
  A demo application I was asked to refactor simulating what I would do if I had to review a junior developer’s code. The README in the repository has more details.

- **[SnapCrackle](https://github.com/The-Running-Dev/Demo-SnapCrackle)**  
  Who hasn’t done a Fizz/Buzz coding exercise? Here is mine I did in real time during a job interview.

- **[Starter](https://github.com/The-Running-Dev/Starter.Stage7)**  
  A project containing "Starter Tasks", a project I worked on to get familiar with the technology stack of an employer.

- **[Thum.io](https://github.com/The-Running-Dev/Thum.io)**  
  A package and command line client to interact with the Thum.io screenshot API service.


## NodeJS / TypeScript

- **[Docker-Webhooks](https://github.com/The-Running-Dev/Docker-Webhooks)**  
  A NodeJS API with Express to manage local docker containers. I created this to expose through Cloudflared, so I can pull and update my local running Docker images based on posting a Webhook from a GitHub workflow. Still in progress.

- **[NetAssure API](https://github.com/The-Running-Dev/Demo-NetAssure/tree/master/web-client/server)**  
  A project for a network hardware company that aims to manage and expose device data hosted in Zabbix. This is the web API, written on top of NodeJS with Express and hosted on CentOS. This project used Docker and Docker Compose for managing the app code and infrastructure, and TeamCity as the build server, on top of CentOS.

- **[NetAssure Notification Service](https://github.com/The-Running-Dev/Demo-NetAssure/tree/master/NotificationService)**  
  A project that triggers sending notifications to an user when certain conditions are met. Made to be hosted as a micro-service on AWS Lambda.

- **[Shopping Service](https://github.com/The-Running-Dev/Demo-ShoppingService)**  
  A demo application as a micro service I created as a take home project for a company I interviewed with. It takes the user’s ZIP code, calls an external API to get the weather for that service, and then suggest the appropriate clothing to buy. It comes with a simple Angular UI to be able to test the application locally without constructing the initial API call yourself. The UI demo no longer functions as the underlying weather API has changed.

[Back to Overview](intro.md)
