# Read me!
### or don't, I'm just text

This is a regular [Next.js](https://nextjs.org) app created using [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Given it's demo state, it is recommended to run using `npm next dev` and open [http://localhost:3000](http://localhost:3000).

The contract address is hardcoded in `src/app/page.tsx` and the smart contract is published on the SepoliaETH test net.

1. copy and paste your wallet address into the `from:` input, then click on `Connect to metamask`, to connect your metamask wallet,
2. perform actions.

actions include:
- giving tokens (you own) to others'.
    - input the token `id` and `target wallet` into the appropriate fields
    - click on `Give token`
    - follow the status of the transaction at the bottom of the page
- checking the ownership of a token
    - input the token `id`
    - click on `Find token owner`
    - an alert and message at the bottom of the page will tell you who owns the token
- creating a new token
    - click on `Create new token`
    - follow the status of the transaction underneath

The single-page application may run locally, but the functionality relies on Web3, so others can see the effects of your transactions.