const SHA256 = require("crypto-js/sha256");

class Transaction {
  constructor(timestamp, payerAddr, payeeAddr, amount) {
    this.timestamp = timestamp;
    this.payerAddr = payerAddr;
    this.payeeAddr = payeeAddr;
    this.amount = amount;
  }
}
// to define a single block
class Block {
  constructor(timestamp, txns, previousHash) {
    this.timestamp = timestamp;
    this.txns = txns;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.txns) +
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
    this.chain = [];
    this.difficulty = 3;
    this.unminedTxns = [];
    this.minigReward = 50;
    this.registeredAddresses = [
      "wallet-Alice",
      "wallet-Bob",
      "wallet-Charlie",
      "wallet-Miner49r",
    ];
    this.createGenesisBlock();
    this.airdropCoins(100);
  }

  airdropCoins(coins) {
    for (const addr of this.registeredAddresses) {
      let txn = new Transaction(Date.now(), "mint", addr, coins);
      this.unminedTxns.push(txn);
    }
    this.mineCurrentBlock("wallet-Miner49r");
  }

  createGenesisBlock() {
    // manualy
    // return new Block(0, "09/08/2024", "Genesis Block", "0");

    // auto generate
    let txn = new Transaction(Date.now(), "mint", "gemesis", 0);
    let block = new Block(Date.now(), [txn], "0");
    this.chain.push(block);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  // addBlock(newBlock) {
  //   newBlock.previousHash = this.getLatestBlock().hash;
  //   newBlock.mineBlock(this.difficulty);
  //   this.chain.push(newBlock);
  // }

  mineCurrentBlock(minerAddr) {
    let validateTxn = [];

    for (const txn of this.unminedTxns) {
      if (txn.payerAddr === "mint" || this.validateTransaction(txn)) {
        validateTxn.push(txn);
      }
    }

    let block = new Block(
      Date.now(),
      validateTxn, // old value =>this.unminedTxns,
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty);
    console.log("Current Block successfully mined...");

    this.chain.push(block);

    this.unminedTxns = [
      new Transaction(Date.now(), "mint", minerAddr, this.minigReward),
    ];
  }

  validateTransaction(txn) {
    let payerAddr = txn.payerAddr;
    let balance = this.getAddressBalance(payerAddr);
    if (balance >= txn.amount) {
      return true;
    }
    return false;
  }

  createTransaction(txn) {
    this.unminedTxns.push(txn);
  }

  getAddressBalance(addr) {
    let balance = 0;
    for (const block of this.chain) {
      for (const txn of block.txns) {
        if (txn.payerAddr === addr) {
          balance -= txn.amount;
        }
        if (txn.payeeAddr === addr) {
          balance += txn.amount;
        }
      }
    }
    return balance;
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

let demoCoin = new Blockchain();

// 1st block
demoCoin.createTransaction(
  new Transaction(Date.now(), "wallet-ALice", "wallet-Bob", 50)
);
demoCoin.createTransaction(
  new Transaction(Date.now(), "wallet-Bob", "wallet-ALice", 25)
);

console.log("\nMining a block:");
demoCoin.mineCurrentBlock("wallet-Miner49r");

console.log("\nBalance: Alice: ", +demoCoin.getAddressBalance("wallet-ALice"));
console.log("\nBalance: Bob: ", +demoCoin.getAddressBalance("wallet-Bob"));
console.log(
  "\nBalance: Miner49r: ",
  +demoCoin.getAddressBalance("wallet-Miner49r")
);

// 2nd block
demoCoin.createTransaction(
  new Transaction(Date.now(), "wallet-ALice", "wallet-Bob", 50)
);
demoCoin.createTransaction(
  new Transaction(Date.now(), "wallet-Bob", "wallet-ALice", 25)
);

console.log("\nMining a block:");
demoCoin.mineCurrentBlock("wallet-Miner49r");

console.log("\nBalance: Alice: ", +demoCoin.getAddressBalance("wallet-ALice"));
console.log("\nBalance: Bob: ", +demoCoin.getAddressBalance("wallet-Bob"));
console.log(
  "\nBalance: Miner49r: ",
  +demoCoin.getAddressBalance("wallet-Miner49r")
);

// ************************

// let demoChain = new Blockchain();

// console.log("Starting to mine a new block...");
// demoChain.addBlock(new Block(1, "10/08/2024", { amount: 10 }));

// console.log("Starting to mine a new block...");
// demoChain.addBlock(new Block(2, "11/08/2024", { amount: 25 }));

// console.log(JSON.stringify(demoChain, null, 4));
