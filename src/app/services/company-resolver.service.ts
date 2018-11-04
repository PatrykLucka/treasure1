import { Injectable, Inject } from '@angular/core';
import { WEB3 } from '../web-token/web3-token';
import * as Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class CompanyResolverService {

    public contract: any;
    public companyResolverAbi = require('../../../ethereum/build/contracts/CompanyResolver.json').abi;

    constructor(@Inject(WEB3) public web3: Web3) {}

    setContract(address: string) {
        this.contract = new this.web3.eth.Contract(this.companyResolverAbi, address, {
            from: this.web3.eth.defaultAccount, // default from address
            gasPrice: '20000000000', // default gas price in wei, 20 gwei in this case
            data: '0x2878797211bf7ddd689d158f9796b3e5b1bd3d7f'
        });
    }

    getDescription() {
        console.log('contract companyResolver: ', this.contract);
        this.contract.methods.getDescription(1).call()
            .then(result => console.log('getDesc: ', result));
    }

    setDescription(description: string) {
        console.log('setting companyResolver: ', this.contract);
        this.contract.methods.setDescription(this.web3.utils.asciiToHex(description)).call()
            .then(result => console.log('setDesc: ', result));
    }
}
