import { Injectable, Inject } from '@angular/core';
import { WEB3 } from '../web-token/web3-token';
import * as Web3 from 'web3';
import * as namehash from 'eth-ens-namehash';

@Injectable({
    providedIn: 'root'
})
export class EnsService {

    public contract: any;
    public ensAbi = require('../../../ethereum/build/contracts/ENSRegistry.json').abi;

    constructor(@Inject(WEB3) public web3: Web3) { }

    setContract(address: string) {
        this.contract = new this.web3.eth.Contract(this.ensAbi, address, {
            from: this.web3.eth.defaultAccount, // default from address
            gasPrice: '20000000000', // default gas price in wei, 20 gwei in this case
        });
    }

    setAddress(ensName: string, address: string) {
        this.contract.methods.setOwner(namehash.hash(ensName), address).send()
            .then(result => console.log('done: ', result));
    }

    getAddress(ensName: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.contract.methods.owner(namehash.hash(ensName)).call()
                .then(result => result ? resolve(result) : reject(result));
        });
    }
}
