const SHA256 = require("crypto-js/sha256");

// to define a single block
class Block {
  constructor(index, timestamp, data, previousHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    let count = 0;
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      ++this.nonce;
      ++count;
      this.hash = this.calculateHash();
    }
    console.log("Block Successfully Hashed:", { hash: this.hash, count });
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  createGenesisBlock() {
    return new Block(0, "09/08/2024", "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
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

console.log("Starting to mine a new block...");
demoChain.addBlock(new Block(1, "10/08/2024", { amount: 10 }));

console.log("Starting to mine a new block...");
demoChain.addBlock(new Block(2, "11/08/2024", { amount: 25 }));

console.log(JSON.stringify(demoChain, null, 4));
