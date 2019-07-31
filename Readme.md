## Truffle University Project - BlockchainAsset.me (BAsset)

BAsset is a decentralized application (DApp) that tracks your belongings and gives a fair market value.

## Installation Steps

## Main Directory - Commands - To Run local test blockchain

Open a command window #1, run these scripts

1. npm install -d
2. truffle develop
3. migrate --reset

## /app Directory - Commands - To Run local web server

Open a command window #2, run these scripts

1. npm install -d
2. Add Google API credentials in app/src/config.js (contact me for keys)
3. npm start

## /app/priceapi Directory - Commands - To Run price web service

Open a command window #3, run these scripts

1. npm install -d
2. Add ebay API credentials on line 42 (contact me for keys)
3. node app.js

## Metamask

1. Make sure Metamask is using the local test blockchain ( http://127.0.0.1:9545 )
2. Import Account with private key from local blockchain instance (truffle develop window #1)

## Known Issues

1. Firewall blocks IPFS on some machines
2. ~~Wrong Nonce error when trying to add an item from a second Account~~ (Fixed: Transactions need to be reset in Metamask, Settings->Advanced->Reset Account)
3. IPFS stores buffer text not image
4. Moesif CORS needs to be turned On for local Price API

## Technology Used

1. Ethereum
2. Truffle with Drizzle
3. IPFS with Infura
4. Metamask
5. Google Vision
6. eBay API
