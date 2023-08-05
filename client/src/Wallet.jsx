import server from "./server";
import { getPublicKey, getWalletAddress, getNoHexPublicKey } from "./helper";
import { toHex, hexToBytes } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, privateKey, setPrivateKey, balance, setBalance }) {

  async function onChange(evt) {
    const prik = evt.target.value;
    const address = getPublicKey(prik, false);

    setAddress(address);
    setPrivateKey(prik);

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key<br/>
        <input placeholder="Private Key" value={privateKey} onChange={onChange}></input>
      </label>

      <div>
        Wallet Address: {privateKey? getWalletAddress(getNoHexPublicKey(privateKey)): ''}.
      </div>
      
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
