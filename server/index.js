
import express from "express";
const app = express();
import { createMessageHash, verify } from "./scripts/helper.js";
// const cors = require("cors");
import cors from "cors";
const port = 3042;

app.use(cors());
app.use(express.json());

/*
1. BOB
WALLET: 43d5d0bbb5286472e17b5f666dcdb7f7c3aa1e75
PRIK: 191816b355331653e3aa82210c2e17e54365de9cd1fef760175e31d1f88c79d7
PUBK: 04427d051d4efb2c32eec1191875efe979b93f6de73a23e2dfee65094e8d4565ac3279e8e2207d5c162ee9ab43404bba9b4a85f3bbe3ec0724139fba9d38751a5f

2. ALICE
WALLET: 6997aab149b85ccb2e436399be33b0dc2cc9ef3c
PRIK:  fe36ddb637bb932e7c643875c43b23eba061c4b18113bad948f851617da2318f
PUBK:  0404c8cff7857f2f32b0194e8095ec6d89b6d59ad1a2c4b0eb12a620e90e00df8f634159737cd40b8dcf86fd07e5bc24e0aeee6a9e44e8ff7a78a3fea3b65aea9c

3. CHARLIE
WALLET: 6ebc9a8a2d46faea61855806a50f336143fd08b9
PRIK:  415059763e3ee614e63a6e83c4572990356e80d44fdcbab30336187c144bf318
PUBK:  04f5414ef2c03ef17510f90b03a6f3685e33b09b54d138000d3347fbb57a07534e777c1bd34e69b5926fbca50694391beb6cd67d9aa6d88d4fc26c18036adc5c46
*/

const balances = {
  "04427d051d4efb2c32eec1191875efe979b93f6de73a23e2dfee65094e8d4565ac3279e8e2207d5c162ee9ab43404bba9b4a85f3bbe3ec0724139fba9d38751a5f": 100,
  "0404c8cff7857f2f32b0194e8095ec6d89b6d59ad1a2c4b0eb12a620e90e00df8f634159737cd40b8dcf86fd07e5bc24e0aeee6a9e44e8ff7a78a3fea3b65aea9c": 50,
  "04f5414ef2c03ef17510f90b03a6f3685e33b09b54d138000d3347fbb57a07534e777c1bd34e69b5926fbca50694391beb6cd67d9aa6d88d4fc26c18036adc5c46": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, message } = req.body;

  const sig = {
    ...signature,
    r: BigInt(signature.r),
    s: BigInt(signature.s)
  }

  const isValidSig = verify(sig, createMessageHash(message), sender);

  if(!isValidSig) {
    res.status(400).send({ message: "Invalid Signature!"})
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
