# lessons learned
## day1
- ~~ctas, then element selector~~ css selector logic
- fetch.js is a thing?
- where to put api routes, because src/app, not pages
- const silently prevents modifications? (updating an array before calling setState hook)

## day2
- basics of solidity: syntax and it's execution model (contracts have their own addresses and consequently balances?). Learned almost entirely from the docs, youtube was useless.
- wrote minimal NFT contract
- remix might be buggy because I can't enable via-IR to use custom errors and strings incrase gas cost to inf wei :(
- setting up the api was a waste of time
- interfacing with the metamask plugin on the client side
- interfacing with said contract via metamask provider
- struggled with CSS and messy HTML since the requirement was to keep it in a single file and single page
- how to *correctly* handle promises in react? rerenders re-execute all code in the function..

## day3
- got view functions working
- got transaction functions started, but unable to track events
- expected to finish, instead everything breaks (ipfs no longer handled automatically by remix)
- got an API key from infura, but even their own demos don't work (screenshot)
- turns out event listeners silently error if defined incorrectly

