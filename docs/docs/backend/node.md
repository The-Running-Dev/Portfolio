---
sidebar_position: 2
---
# NodeJS

## [BarStrad-Bot](https://github.com/The-Running-Dev/BarStrad-Bot) 

A TypeScript-based Discord bot for restaurants and bars, featuring multilingual support, order management, and containerized deployment.

## [Docker-Webhooks](https://github.com/The-Running-Dev/Docker-Webhooks)

**Updated**: April 8, 2025 @ 08:34

A NodeJS API with Express to manage local docker containers. I created this to expose through Cloudflared, so I can pull and update my local running Docker images based on posting a Webhook from a GitHub workflow. Still in progress.

## [NetAssure API](https://github.com/The-Running-Dev/Demo-NetAssure/tree/master/web-client/server)

**Updated**: April 16, 2019 @ 21:23

A project for a network hardware company that aims to manage and expose device data hosted in Zabbix. This is the web API, written on top of NodeJS with Express and hosted on CentOS. This project used Docker and Docker Compose for managing the app code and infrastructure, and TeamCity as the build server, on top of CentOS.

## [NetAssure Notification Service](https://github.com/The-Running-Dev/Demo-NetAssure/tree/master/NotificationService)

**Updated**: April 16, 2019 @ 21:23

A project that triggers sending notifications to an user when certain conditions are met. Made to be hosted as a micro-service on AWS Lambda.

## [Shopping Service](https://github.com/The-Running-Dev/Demo-ShoppingService)

**Updated**: July 19, 2017 @ 00:07

A demo application as a micro service I created as a take home project for a company I interviewed with. It takes the user’s ZIP code, calls an external API to get the weather for that service, and then suggest the appropriate clothing to buy. It comes with a simple Angular UI to be able to test the application locally without constructing the initial API call yourself. The UI demo no longer functions as the underlying weather API has changed.

[Back to Top](node.md)