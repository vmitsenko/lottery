# lottery


## Project structure

-   `contracts` - source code of the main contract, written in TACT.
-   `build` - source code compiled in FunC.
-   `tests` - tests for the contract, written in Typescript
-   `scripts`
- `getStats.ts` - script to get some statistics of the past draws (recent draw result, total number of draws/wins and etc).

## Contract info

- `EQC9aSK1F7md2U8fGRnsvB9hm0IWPs0-wjOeUcnLvzMGBTfE` - main contract address. Main contract is deployed on the testnet, basechain.
- 'Ef-z--k3eVXf1UGE2YO0hArWaC8bMEs9uWc-PJ95DSHeRM_5` - echo contract address. Echo contract is deployed on the testnet, masterchain.

Echo contract is used to implement a safer way of random numbers generation 
https://docs.ton.org/develop/smart-contracts/guidelines/random-number-generation#main-contract-in-any-workchain

## Contract constants


## Messages:
Contract recieves the following messages:
-   `donation` - top up contract balance 
-   `bet` - uses simple random number generation (using randomize_lt) 
-   'safe bet' - uses echo contract to complicate the substitution of the seed by validators, require more gas cost. 


## How to use



### Build

`npx blueprint build` or `yarn blueprint build`

### Test

`npx blueprint test` or `yarn blueprint test`

### Deploy or run another script

`npx blueprint run` or `yarn blueprint run`

### Add a new contract

`npx blueprint create ContractName` or `yarn blueprint create ContractName`
