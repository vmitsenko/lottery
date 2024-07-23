# lottery


## Project structure

-   `contracts` - source code of the main contract, written in TACT.
-   `build` - source code compiled in FunC.
-   `tests` - tests for the contract, written in Typescript
-   `scripts/getStats.ts` - script to get some statistics of the past draws (recent draw result, total number of draws/wins and etc).

## Contract info

- `EQC9aSK1F7md2U8fGRnsvB9hm0IWPs0-wjOeUcnLvzMGBTfE` - main contract address. Main contract is deployed on the testnet, **BaseChain**.
- `Ef-z--k3eVXf1UGE2YO0hArWaC8bMEs9uWc-PJ95DSHeRM_5` - echo contract address. Echo contract is deployed on the testnet, **MasterChain**.

Echo contract is used to implement a safer way of random numbers generation 

https://docs.ton.org/develop/smart-contracts/guidelines/random-number-generation#main-contract-in-any-workchain

- Gas and transaction fees are paid by the sender. In case of winning, the sender receives 2 * BET - (gas + transaction cost).
- Contract's minimum ton balance is set to 0.3 TON.

## Messages:
Contract recieves the following messages:
-   `donation` - top up contract balance 
-   `bet` - uses simple random number generation (using randomize_lt) 
-   'safe bet' - uses echo contract to complicate the substitution of the seed by validators, gas fees are higher in this case. 
- Safe bet should be at least 0.1 TON

## How to use

- Switch TON Keeper to testnet
- Send "bet" or "safe bet" to the main contract
- Track all transactions by the link below: 
https://testnet.tonscan.org/address/EQC9aSK1F7md2U8fGRnsvB9hm0IWPs0-wjOeUcnLvzMGBTfE
- Alternatively, use getStats.ts script to see some statistics

### Build

`npx blueprint build` or `yarn blueprint build`

### Test

`npx blueprint test` or `yarn blueprint test`

### Run scripts

`npx blueprint run` or `yarn blueprint run`

