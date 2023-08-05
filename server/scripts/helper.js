import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { utf8ToBytes, toHex, hexToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

export const createMessageHash = (message) => keccak256(utf8ToBytes(message));

export const createSignature = (hashMessage, privateKey) => secp256k1.sign(hashMessage, privateKey);

export const getPublicKey = (privateKey) => toHex(secp256k1.getPublicKey(privateKey, false));

export const getNoHexPublicKey = (privateKey) => secp256k1.getPublicKey(privateKey, false);

export const verify = (signature, hashMessage, publicKey) => secp256k1.verify(signature, hashMessage, publicKey);

export const getWalletAddress = (publicKey) => {
    const _addr = keccak256(publicKey.slice(1));
    const addr = _addr.slice(-20);
    return toHex(addr);
}