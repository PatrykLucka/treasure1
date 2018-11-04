import { Injectable, Inject } from '@angular/core';
import { WEB3 } from '../web-token/web3-token';
import * as Web3 from 'web3';
import { Observable } from 'rxjs';
import { UtilsService } from './utils.service';
import * as namehash from 'eth-ens-namehash';
import * as ethUtil from 'ethereumjs-util';

@Injectable({
    providedIn: 'root'
})
export class WalletService {

    public contract: any;
    public walletResolverAbi = require('../../../ethereum/build/contracts/Wallet.json').abi;

    public users: any[];
    public users$: Observable<any[]>;

    public destinationAddress = '0xE5974BDf74ae3cEa3F56f07261fcFcACc104Ae52';

    constructor(@Inject(WEB3) public web3: Web3, public utils: UtilsService) { }

    setContract(address: string) {
        this.contract = new this.web3.eth.Contract(this.walletResolverAbi, address, {
            from: this.web3.eth.defaultAccount, // default from address
            gasPrice: '20000000000', // default gas price in wei, 20 gwei in this case
            data: ['0x2878797211bf7ddd689d158f9796b3e5b1bd3d7f', 1]
        });
    }

    getUserData(address: string) {
        return new Promise((resolve, reject) => {
            if (!this.contract || !address) {
                this.web3.eth.getAccounts()
                    .then(((accounts) => {
                        this.web3.eth.defaultAccount = accounts[0];
                        this.contract = new this.web3.eth.Contract(this.walletResolverAbi, '0x095344a347a28f5e26438f1ca00772b1c33bdda9', {
                            from: accounts[0], // default from address
                            gasPrice: '20000000000', // default gas price in wei, 20 gwei in this case
                            data: ['0x2878797211bf7ddd689d158f9796b3e5b1bd3d7f', 1]
                        });
                        this.contract.methods.getUser(accounts[0]).call()
                            .then(result => resolve(result));
                    }));
            } else {
                this.contract.methods.getUser(address).call()
                    .then(result => resolve(result));
            }
        });
    }

    isUnderLimit(address: string, amount: number) {
        this.contract.methods.isUnderLimit(address, amount).call()
            .then(result => console.log(result));
    }

    changeLimit(address: string, limit: number) {
        this.contract.methods.changeLimit(address, this.web3.utils.toWei(limit.toString(), 'ether')).call()
            .then(result => console.log(result));
    }

    async executeSignedTransaction(amount) {
        const permissionString = this.web3.utils.soliditySha3(
            'executeTransaction',
            '0x095344a347a28f5e26438f1ca00772b1c33bdda9',
            this.destinationAddress,
            this.web3.utils.toWei(amount.toString(), 'ether'),
            namehash.hash('')
        );
        console.log('random? ', permissionString);

        // const permission = await this.utils.sign(permissionString, '0xbc7C268644a3963CFabc00845430cc29612fb061',
        //     '33c2c0bfd3194c393f6f2e3f1a7bde5e863a41c9123932b0826404b636d7a52d') as any;

        const concatenatedSignature = await this.web3.eth.sign(permissionString, this.web3.eth.defaultAccount);
        const signature = ethUtil.fromRpcSig(concatenatedSignature);
        // const signature = await this.utils.sign(permissionString,
        //     this.web3.eth.defaultAccount, '45d9229772216d7c8f075506fdb5d2b1c40605c7c289b8a3ac734b4c5633bded') as any;
        console.log('signature: ', signature);
        console.log('MyAddress', this.web3.eth.defaultAccount);
        console.log('DesAddress', this.destinationAddress);
        console.log('Amount', amount);
        console.log('Hash', namehash.hash(''));

        await this.web3.eth.getTransactionCount('0xbc7C268644a3963CFabc00845430cc29612fb061', async (err, txCount) => {
            console.log('nonce: ', txCount);
            this.utils.sendAsOwner(this.contract.methods.executeTransactionSigned(
                this.web3.eth.defaultAccount,
                signature.v,
                signature.r,
                signature.s,
                this.destinationAddress,
                this.web3.utils.toWei(amount.toString(), 'ether'),
                namehash.hash('')
            ),
                '0x095344a347a28f5e26438f1ca00772b1c33bdda9', txCount);
        });
    }
}
