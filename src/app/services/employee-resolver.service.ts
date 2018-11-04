import { Injectable, Inject } from '@angular/core';
import { WEB3 } from '../web-token/web3-token';
import * as Web3 from 'web3';
import { UtilsService } from './utils.service';

@Injectable({
    providedIn: 'root'
})
export class EmployeeResolverService {
    public contract: any;
    public contractAddress: string;
    public employeeResolverAbi = require('../../../ethereum/build/contracts/EmployeeResolver.json').abi;

    constructor(@Inject(WEB3) public web3: Web3,
                public utils: UtilsService) { }

    setContract(address: string) {
        this.contractAddress = address;
        this.contract = new this.web3.eth.Contract(this.employeeResolverAbi, address, {
            from: this.web3.eth.defaultAccount, // default from address
            gasPrice: '20000000000', // default gas price in wei, 20 gwei in this case
            data: '0x2878797211bf7ddd689d158f9796b3e5b1bd3d7f'
        });
    }

    addDescription(address: string, description: string, nonce?: number) {
        return new Promise((resolve, reject) => {
            return this.utils.sendAsOwner(
                this.contract.methods.addEmployeeDesc(address, description),
                this.contractAddress,
                nonce
            );
        });
    }

    getDescription(address: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.contract.methods.getEmployeeDesc(address).call()
                .then(result => result ? resolve(result) : reject(result));
        });
    }
}
