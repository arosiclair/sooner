![Sooner](docs/images/banner-promo-1650.png)
==========

The *anti* reading list. Sooner is a web app and chrome extension offering an ephemeral reading list where entries are expire after a few days giving users a self-cleaning reading list. Sooner is written with a number of JS packages and backed by MongoDB.

The source on `production` branch is live at [sooner.app](https://sooner.app)

This respository is configured using NPM workspaces and requires NPM v7.0+

## App `packages/app`

A single page application and Progressive Web App written with Vue. This is Sooner's primary application allowing users to register, manage their list, and adjust their preferences.

## API `packages/api`

A REST API written with ExpressJS providing the majority of Sooner's backend services including authentication and list and user management.

## Browser Extension `packages/browser-ext`

A cross-platform browser extension written with Vue. Adds a shortcut in browsers to quickly add links to a user's list.

## Push API `packages/push-api`

A REST API written with ExpressJS providing push notification settings and scheduling for users.
