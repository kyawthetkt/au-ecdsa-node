
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { toHex } from "ethereum-cryptography/utils.js";
import { getWalletAddress } from "./helper.js";

function generateKey() {
    const prik = secp256k1.utils.randomPrivateKey(); 
    const pubk = secp256k1.getPublicKey(prik, false);
    return {
        privateKey: toHex(prik),
        publicKey: toHex(pubk),
        wallet: getWalletAddress(pubk)
    };
}
// console.log( generateKey() );
// 191816b355331653e3aa82210c2e17e54365de9cd1fef760175e31d1f88c79d7
console.log( getWalletAddress(secp256k1.getPublicKey("191816b355331653e3aa82210c2e17e54365de9cd1fef760175e31d1f88c79d7", false)) );