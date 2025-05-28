# Portfolio

- [Portfolio](#portfolio)
  - [Latest Updates](#latest-updates)
  - [Angular](#angular)
  - [C#/.NET](#cnet)
  - [Infrastructure](#infrastructure)
  - [Linux/Bash](#linuxbash)
  - [NodeJS/TypeScript](#nodejstypescript)
  - [PowerShell](#powershell)
  - [PowerShell/Chocolatey/NuGet](#powershellchocolateynuget)
  - [PowerShell/WinGet/DevOps](#powershellwingetdevops)

v2025.05.28

[LinkedIn](http://www.linkedin.com/in/therunningdev)

[GitHub](https://github.com/The-Running-Dev)

## Latest Updates
- [2025.05.28. Docker-DNSAtHome: Encrypted DNS, Blocklists, Discord Notifications](#docker-dnsathome)
- [2025.05.28. Docker-BuildAgent: Pre-configured CI/CD Build Agent](#docker-buildagent)
- [2025.05.28. Docker-Watchdog: Automated Docker Compose Management](#docker-watchdog)
- [2025.05.28. Docker API in NodeJS for Managing Local Containers](#docker-webhooks)
- [2025.05.28. Working Menu Application, with Discord Bot](#barstrad)
- [2025.05.28. Working Menu Application, with Discord Bot](#barstrad)
- [2025.02.12. Docker API in NodeJS for Managing Local Containers](#docker-webhooks)
- [2025.02.09. Working Menu Application, with Discord Bot](#barstrad)
- [2025.01.23. Image Event Processor WebAPI on AWS Lambda](#image-event-processor)
- [2023.11.14. SideQuest Easy Installer WinGet Package](#winget-packages)
- [2023.11.14. XYplorer WinGet Package](#winget-packages)

## Angular

[🔝](#portfolio)

- [BarStrad](https://github.com/The-Running-Dev/BarStrad)

   Angular based menu application, with theming, language support, orders, and a Discord notifications and a separate menu Discord bot. Proof of concept.

- [Manual Tests](https://github.com/The-Running-Dev/Contec-ManualTests)

   A line of business application that provided for recording manually tested equipment.

   One of the 2 Angular projects I put in production during my time at Contec. It was part of a bigger ASP.NET WebForms application and is not meant to run by itself.

- [NetAssure Client](https://github.com/The-Running-Dev/Demo-NetAssure/tree/master/web-client/src)

   A project for a network hardware company that aims to manage and expose device data hosted in Zabbix, with the users being managed in Salesforce.

   This project used Docker and Docker Compose for managing the app code and infrastructure, and TeamCity as the build server, on top of CentOS.

- [PatientViewer.NG](https://github.com/The-Running-Dev/Demo-PatientVIewer.NG)

   A project to showcase my Angular skills. It's a simple applications that displays a list of patients. The README in the repository documents the structure and implementation.

- [Repairs](https://github.com/The-Running-Dev/Contec-Repairs)

   Another line of business application for recording repairs to broken equipment. As with the Manual Tests project, part of a bigger ASP.NET WebForm solution.

- [Rock Paper Scissors](https://github.com/The-Running-Dev/Demo-RockPaperScissors)

   An Angular implementation of the classic rock paper scissors game, with a twist.

## C#/.NET

[🔝](#portfolio)

- ### [AliaSQL](https://github.com/The-Running-Dev/Database-AliaSQL)

   Open source project I contributed to. AliaSQL was aimed at providing versioning for database deployments.

- ### [Business Intelligence](https://github.com/The-Running-Dev/Contec-BusinessIntelligence)

   I spent 6 months evaluating BI tools to help the company analyse the vast amount of data they collected. This project is the web interface I created to expose the data charted through PowerBI.

- ### [Code Generator](https://github.com/The-Running-Dev/Tools-CodeGenerator)

   This project uses Razor as the template engine, and given source templates, and access to the source database, generates the needed classes to implement the desired pattern.

   Context: I introduced a team I worked with to Dapper (a micro ORM), and over time I saw a need to generate a lot of classes based in the repository pattern I implemented in Dapper.

- ### [Image Event Processor](https://github.com/The-Running-Dev/Demo-ImageEventProcessor)

   An .NET WebAPI hosted in AWS Lambda, with an Angular UI, as a demo for processing images.

- ### [Menu Creator](https://github.com/The-Running-Dev/Demo-MenuCreator)

   A simple menu creator on top of .NET Core 2.2. This application is a coding exercise I was given and expected to complete in 60 minutes. The README in the repository documents the structure and implementation.

- ### [OctopusDeploy-CruiseControlTray](https://github.com/The-Running-Dev/OctopusDeploy-CruiseControlTray)

   I am a CI/CD fanatic! There is a tool called CruiseControlTray initially implemented to be used with CruiseControl.NET. The tool can speak the status of the build based on accessing XML API available in CruiseControl.NET.

   While at MxToolbox, we had 50 inch TVs in every room, and the shared dev office had 4! This project translated the OctopusDeploy build status in the XML format that CruiseControlTray understood. That way we would get audio and video notifications of the deployment status.

- ### [PatientViewer.NET](https://github.com/The-Running-Dev/Demo-PatientVIewer.NET)

   A project to showcase my .NET skills. It's a simple ASP.NET MVC/WebAPI application that displays a list of patients. The README in the repository documents the structure and implementation.

- ### [Refactoring Exercise](https://github.com/The-Running-Dev/Demo-RefactoringExercise)

   A demo application I was asked to refactor simulating what I would do if I had to review a junior developer’s code. The README in the repository has more details.

- ### [SnapCrackle](https://github.com/The-Running-Dev/Demo-SnapCrackle)

   Who hasn’t done a Fizz/Buzz coding exercise? Here is mine I did in real time during a job interview.

- ### [Starter](https://github.com/The-Running-Dev/Starter.Stage7)

   A project containing "Starter Tasks", a project I worked on to get familiar with the technology stack of an employer.

- ### [Thum.io](https://github.com/The-Running-Dev/Thum.io)

   A package and command line client to interact with the Thum.io screenshot API service.

## Infrastructure

- ### [Docker-DNSAtHome](https://github.com/The-Running-Dev/Docker-DNSAtHome)

   DNS At Home is a containerized solution for running dnscrypt-proxy at home, providing encrypted DNS, blocklists, and automated health monitoring. It is designed for easy deployment via Docker, with built-in Discord notifications and automated blocklist updates.

- ### [Docker-BuildAgent](https://github.com/The-Running-Dev/Docker-BuildAgent)

   Docker-BuildAgent is a pre-configured Docker image designed to serve as a build agent for CI/CD pipelines. It comes with Node.js, Angular CLI, TypeScript, Docker, and PowerShell pre-installed, making it ideal for building, testing, and deploying JavaScript/TypeScript and Angular applications in automated environments.

- ### [Docker-Watchdog](https://github.com/The-Running-Dev/Docker-Watchdog)

   Docker-Watchdog is a robust, containerized management and automation tool for Docker Compose environments. It automatically keeps your containers up-to-date, monitors their health, and provides a RESTful API for integration with monitoring tools like Uptime Kuma. It is designed for self-hosters and DevOps engineers who want hands-off, reliable, and observable Docker operations.

## Linux/Bash

[🔝](#portfolio)

- ### [Ubuntu Setup](https://github.com/The-Running-Dev/Setup-Ubuntu)

   A set of ```Bash``` scripts that install and configure a new Ubuntu installation.

## NodeJS/TypeScript

[🔝](#portfolio)

- ### [Docker-Webhooks](https://github.com/The-Running-Dev/Docker-Webhooks)

   A NodeJS API with Express to manage local docker containers. I created this to expose through Cloudflared, so I can pull and update my local running Docker images based on posting a Webhook from a GitHub workflow. Still in progress.

- ### [NetAssure API](https://github.com/The-Running-Dev/Demo-NetAssure/tree/master/web-client/server)

   A project for a network hardware company that aims to manage and expose device data hosted in Zabbix.

   This is the web API, written on top of NodeJS with Express and hosted on CentOS.

   This project used Docker and Docker Compose for managing the app code and infrastructure, and TeamCity as the build server, on top of CentOS.

- ### [NetAssure Notification Service](https://github.com/The-Running-Dev/Demo-NetAssure/tree/master/NotificationService)

   A project that triggers sending notifications to an user when certain conditions are met. Made to be hosted as a micro-service on AWS Lambda.

- ### [Shopping Service](https://github.com/The-Running-Dev/Demo-ShoppingService)

   A demo application as a micro service I created as a take home project for a company I interviewed with.

   It takes the user’s ZIP code, calls an external API to get the weather for that service, and then suggest the appropriate clothing to buy. It comes with a simple Angular UI to be able to test the application locally without constructing the initial API call yourself. The UI demo no longer functions as the underlying weather API has changed.

## PowerShell

[🔝](#portfolio)

- ### [iCloudSync](https://github.com/The-Running-Dev/iCloudSync)

   A set of PowerShell scripts to download and organize iCloud media.

- ### [PowerShell-FileButler](https://github.com/The-Running-Dev/PowerShell-FileButler)

   My downloads folder always gets cluttered and I am constantly organizing it. So I wrote the FileButler to do this for me every time there is a new file in the directory. It uses regular expressions and file extensions to clarify, rename, move, transcode and delete files.

- ### [PowerShell-Helpers](https://github.com/The-Running-Dev/PowerShell-Helpers)

   PowerShell-Helpers is my personal repository of PowerShell functions. It contains all kinds of helper functions and utilities. I initially built this as a Chocolatey extension in an effort to provide Chocolatey with the ability to install software already downloaded on the machine (instead of always downloading it). This module is now a permanent module in my PowerShell profile.

## PowerShell/Chocolatey/NuGet

[🔝](#portfolio)

- ### [BoxStarter](https://github.com/The-Running-Dev/BoxStarter)

   BoxStarter is my personal package repository for Chocolatey packages. I worked on these packages in span of 2 years, trying to create the perfect way to re-install my Windows machine from scratch.

- ### [Chocolatey-Core Team Packages](https://github.com/chocolatey/chocolatey-coreteampackages)

   The core repository for Chocolatey packages. I contributed a dozen packages to this repository (like Spotify, JetBrains WebStorm and DataGrip, etc.)

## PowerShell/WinGet/DevOps

[🔝](#portfolio)

- ### [WinGet-Packages](https://github.com/microsoft/winget-pkgs)

   Contributions to the Windows package manager community repository. This repository contains the manifest files for the Windows Package Manager default source.

   SideQuest Easy Installer: <https://github.com/microsoft/winget-pkgs/pull/126347>

   The GitHub workflows for automatic update so new version will be created automatically.

   <https://github.com/The-Running-Dev/Winget-Updates/actions/workflows/sidequest.easyinstaller.yml>

   XYplorer: <https://github.com/microsoft/winget-pkgs/pull/126351>

   XYplorer Portable: <https://github.com/microsoft/winget-pkgs/pull/126622>

   The GitHub workflows for automatic update so new version will be created automatically.

   <https://github.com/The-Running-Dev/Winget-Updates/actions/workflows/xyplorer.yml>

   <https://github.com/The-Running-Dev/Winget-Updates/actions/workflows/xyplorer.portable.yml>