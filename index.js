const SHA256 = require("crypto-js/sha256");

// to define a single block
class Block {
  constructor(index, timestamp, data, previousHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data)
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, "09/08/2024", "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 0; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // validate data integrity
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      // validate hash chain link
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    // all good, no manipulated data of bad links
    return true;
  }
}

let demoChain = new Blockchain();
demoChain.addBlock(new Block(1, "10/08/2024", { amount: 10 }));
demoChain.addBlock(new Block(2, "11/08/2024", { amount: 25 }));

console.log(JSON.stringify(demoChain, null, 4));
