import { useState } from "react";
import server from "./server";
import { createMessageHash, createSignature } from "./helper";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const message = `Send ${sendAmount} to ${recipient} via ECDSA`;
    const signature = createSignature(createMessageHash(message), privateKey);

    try {
      const {
        data,
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature:{
          ...signature,
          r: signature.r.toString(),
          s: signature.s.toString()
        },
        message: message
      });
      const balance = data.balance;
      setBalance(balance);
    } catch (ex) {
      console.log("ex", ex)
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
