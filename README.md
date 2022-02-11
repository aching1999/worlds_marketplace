<p align="center">
  <a href="https://spacebudz.io">
    <img alt="Gatsby" src="./src/images/assets/spacebudz.png" width="60" />
  </a>
</p>
<h1 align="center">
  SpaceBudz
</h1>

SpaceBudz is an NFT collection on Cardano consisting of 10,000 unique little astronauts. We make use of Cardano's multi asset ledger for the NFTs and Plutus validators for the market place.
This repository contains the full market place implementation including the frontend interface.
Our official website: [spacebudz.io](https://spacebudz.io)

### Validity

To make sure you have a real SpaceBud the Policy ID must match the following:
**`3c2cfd4f1ad33678039cfd0347cca8df363c710067d739624218abc0`**

You can find the according policy script in `./minting_policy.json`

The contract address for the official SpaceBudz market place:
**`addr1wyzynye0nksztrfzpsulsq7whr3vgh7uvp0gm4p0x42ckkqqq6kxq`**

### Metadata

We follow [CIP-25](https://github.com/cardano-foundation/CIPs/blob/master/CIP-0025/CIP-0025.md), the NFT metadata standard on Cardano, which was created by SpaceBudz.

Images are stored on IPFS and Arweave and you find the image link to a SpaceBud inside the metadata.

### Market place

The market place can be run by members of the community. They can host the market place with their own custom interface and earn 0.4% per trade.

We have a seperate module inside this repository for the market place with the full source code.

Check it out [here](./src/cardano/market/).
