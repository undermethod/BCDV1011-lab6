const HOSTNAME = "localhost";
const PORT_EXPRESS = 2999;
const PORT_GANACHE = 8545;
const contractAddress = "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab";
const { abi } = require("./abi.js");

const Web3 = require("web3");
const Tx = require("ethereumjs-tx").Transaction;
const BigNumber = require("bignumber.js");
const express = require("express");
const cors = require("cors");
const url = require("url");

const web3 = new Web3(new Web3.providers.HttpProvider(`http://${HOSTNAME}:${PORT_GANACHE}`));
let accounts;
web3.eth.getAccounts().then(acc => accounts = acc);
const acct0PrivateKey = Buffer.from("4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d", "hex");

const SimpleStorage = new web3.eth.Contract(abi, contractAddress);
console.log(SimpleStorage._address === contractAddress ? "contract init sucess" : "contract init fail");

const app = new express();
app.use(cors());
server = app.listen(PORT_EXPRESS, HOSTNAME, () => console.log(`Server running at http://${HOSTNAME}:${PORT_EXPRESS}/`));

app.get("/get", async (req, res, next) => {
  const storedDataBN = await SimpleStorage.methods.get().call({ from: accounts[0] })
    .then(getReturned => new BigNumber(getReturned))
    .catch(err => console.error(err))
  ;
  const storedData = storedDataBN.toNumber();
  console.log("storedData:", storedData);
  res.status = 200; // OK
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(storedData));
});

app.post("/set", async (req, res, next) => {
  const urlQuery = url.parse(req.url, true).query;
  console.log("urlQuery:", urlQuery);
  const valBN = new BigNumber(urlQuery.val);
  const encodedValue = SimpleStorage.methods.set(new BigNumber(valBN)).encodeABI();

  const serializedTx = await web3.eth.getTransactionCount(accounts[0])
    .then(nonce => {
      const rawTx = {
        nonce: nonce,
        gasPrice: '0x20000000000',
        gasLimit: '0x27511',
        to: contractAddress,
        value: 0,
        data: encodedValue
      };
      const tx = new Tx(rawTx);
      tx.sign(acct0PrivateKey);
      return tx.serialize();
    })
  ;
  await web3.eth.sendSignedTransaction("0x" + serializedTx.toString("hex"))
    .on("receipt", (data) => {
      console.log("tx:", data.transactionHash);
      res.status = 200; // OK
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({
        val: valBN.toNumber(),
        tx: data.transactionHash
      }));
    })
    .catch(err => console.error(err))
  ;
});

module.exports = app;
