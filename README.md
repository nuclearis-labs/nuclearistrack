<div style="text-align:center">
<h1>NUCLEARISTrack</h1>

[![Netlify Status](https://api.netlify.com/api/v1/badges/0f631d63-bf4e-4145-b0de-2258d9a9e665/deploy-status)](https://app.netlify.com/sites/sad-heyrovsky-a72589/deploys) [![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)</div>

Decentralized Application for tracking components through multiple suppliers.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Docker](#docker)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Install

```sh
git clone https://github.com/NRS-Soft/nuclearistrack
cd nuclearistrack
yarn install
```

## Usage

### Configure .env variables

Open `.env.example` and make a copy as `.env.local` and fill out the required process variables

```md
REACT_APP_CONTRACT=<CONTRACT ADDRESS AFTER DEPLOYMENT, SEE DEPLOY SMART CONTRACTS>
ADMIN=<ADMIN USERNAME, USED BY DEPLOYMENT>
XXX_PRIVATE_KEYS=<FILL OUT PRIVATE KEYS YOU'LL BE USING FOR DEPLOYMENT, DO NOT COMMIT THEM ANYWHERE>
```

### Deploy Smart Contracts

```sh
npx buidler run ./scripts/deploy.js --network <NETWORK NAME FROM BUIDLER CONFIG>
```

### Test Smart Contracts

```sh
npx buidler test
```

### Start App

```sh
yarn start
```

### Build App

```sh
yarn build
```

## Docker

To mount NuclearisTrack in Docker for local development please complete the following steps:

1. Duplicate `.env.example` and name it `.env.local`
2. Open `.env.local`
3. Set the process variable `ADMIN` to the desired administrator username
4. Start `docker-compose` with the following command `docker-compose up`

## Maintainers

[@sebastinez](https://github.com/sebastinez)

## Contributing

Feel free to contribute.
Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT
