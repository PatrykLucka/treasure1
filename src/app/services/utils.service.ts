import { Injectable, Inject } from '@angular/core';
import { WEB3 } from '../web-token/web3-token';
import * as Web3 from 'web3';
import * as ethUtil from 'ethereumjs-util';
import * as Tx from 'ethereumjs-tx';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    constructor(@Inject(WEB3) public web3: Web3) { }

    public sign(messageHash, address, privateKey) {
        return new Promise(resolve => {
            const signature = ethUtil.ecsign(
                Buffer.from(ethUtil.stripHexPrefix(messageHash), 'hex'),
                Buffer.from(ethUtil.stripHexPrefix(privateKey), 'hex')
            );
            signature.r = ethUtil.bufferToHex(signature.r);
            signature.s = ethUtil.bufferToHex(signature.s);
            signature.v = signature.v;
            resolve(signature);
        });
    }

    public sendAsOwner(contractFunction: any, addressTo: any, nonce?: any) {
        const account1 = '0xbc7C268644a3963CFabc00845430cc29612fb061'; // Your account address 1
        const privateKey1 = Buffer.from('33c2c0bfd3194c393f6f2e3f1a7bde5e863a41c9123932b0826404b636d7a52d', 'hex');
        return new Promise((resolve, reject) => {
            if (!nonce) {
                this.web3.eth.getTransactionCount(account1, async (err, txCount) => {
                    return this.sendAsOwner(contractFunction, addressTo, nonce);
                });
            }

            // Build the transaction
            const txSetOwnerObject = {
                nonce: this.web3.utils.toHex(nonce),
                to: addressTo,
                gasLimit: this.web3.utils.toHex(1000000),
                gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('10', 'gwei')),
                data: contractFunction.encodeABI()
            };

            // Sign the transaction
            const tx = new Tx(txSetOwnerObject);
            tx.sign(privateKey1);

            const serializedTx = tx.serialize();
            const raw = '0x' + serializedTx.toString('hex');

            // Broadcast the transaction
            this.web3.eth.sendSignedTransaction(raw, (err, txHash) => {
                resolve();
                // Now go check etherscan to see the transaction!
            });
        });
    }
}
