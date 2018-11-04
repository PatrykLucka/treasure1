import { Injectable, Inject } from '@angular/core';
import { WEB3 } from '../web-token/web3-token';
import * as Web3 from 'web3';
import * as Tx from 'ethereumjs-tx';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { WalletService } from './wallet.service';
import { EmployeeResolverService } from './employee-resolver.service';
import { SwarmService } from './swarm.service';

interface Identity {
    recoveryAddress: string;
    associatedAddresses: string[];
    providers: string[];
    resolvers: string[];
}

@Injectable({
    providedIn: 'root'
})
export class IdentityService {

    public contract: any;
    public identityAbi = require('../../../ethereum/build/contracts/IdentityRegistry.json').abi;
    public details: Identity = {
        recoveryAddress: '',
        associatedAddresses: [],
        providers: [],
        resolvers: [],
    };
    private detailsSubject: BehaviorSubject<Identity>;

    public details$: Observable<Identity>;

    public buyers$: Observable<string[]>;
    public selectedUser: string;

    constructor(@Inject(WEB3) public web3: Web3,
        public wallet: WalletService, public employeeResolver: EmployeeResolverService,
        public swarm: SwarmService) {
        this.contract = new this.web3.eth.Contract(this.identityAbi, '0x2878797211bf7ddd689d158f9796b3e5b1bd3d7f', {
            from: this.web3.eth.defaultAccount, // default from address
            gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
        });
        this.detailsSubject = new BehaviorSubject(this.details);
        this.details$ = this.detailsSubject.asObservable();
        this.details$.subscribe(details => console.log('test zmiana! ', this.details));
        this.buyers$ = this.details$.pipe(map(item => (<any>item).associatedAddresses.filter(addr => addr !== item['1'][0])));
        this.getDetails();
    }

    getBuyers() {
        return this.buyers$.pipe(
            switchMap(buyers => {
                return Promise.all(buyers.map((buyer) => {
                    return new Promise((resolve, reject) => this.wallet.getUserData(buyer)
                        .then((data: any) => {
                            console.log('user-data: ', data);
                            this.employeeResolver.getDescription(buyer).then(swarmHash => {
                                this.swarm.getFromSwarm(swarmHash.substr(2))
                                    .then((name) => {
                                        resolve({
                                            id: buyer,
                                            name: name,
                                            spent: data['0'] / 1000000000000000000,
                                            limit: data['1'] / 1000000000000000000,
                                            selected: buyer === this.selectedUser,
                                        });
                                    });
                            });
                        }));
                }))
                    .then(result => result);
            }),
        );
    }

    getEIN() {
        return this.contract.methods.getEIN(this.web3.eth.defaultAccount).call()
            .then(result => result);
    }

    getDetails() {
        this.contract.methods.getDetails(1).call()
            .then(result => {
                this.details = {
                    ...result,
                };
                this.detailsSubject.next(this.details);
                console.log(result);
            });
    }

    checkIfExists() {
        console.log('contract: ', this.contract);
        this.contract.methods.identityExists(1).call()
            .then(result => console.log(result));
    }

    isProvider(address: string) {
        return new Promise((resolve, reject) => this.contract.methods.isProviderFor(1, address).call()
            .then(result => result ? resolve(result) : resolve(false))
        );
    }

    addAddress(...params) {
        return new Promise((resolve, reject) => {
            const x = this.contract.methods.addAddress(params[0], params[1], params[2], params[3], params[4], params[5]);

            const account1 = '0xbc7C268644a3963CFabc00845430cc29612fb061'; // Your account address 1

            const privateKey1 = Buffer.from('33c2c0bfd3194c393f6f2e3f1a7bde5e863a41c9123932b0826404b636d7a52d', 'hex');
            console.log('before get Tx addAddress');
            this.web3.eth.getTransactionCount(account1, (err, txCount) => {
                // Build the transaction
                console.log('after get Tx addAddress');
                const txObject = {
                    nonce: this.web3.utils.toHex(txCount),
                    to: '0x2878797211bf7ddd689d158f9796b3e5b1bd3d7f',
                    gasLimit: this.web3.utils.toHex(1000000),
                    gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('10', 'gwei')),
                    data: x.encodeABI()
                };

                // Sign the transaction
                const tx = new Tx(txObject);
                tx.sign(privateKey1);

                const serializedTx = tx.serialize();
                const raw = '0x' + serializedTx.toString('hex');

                // Broadcast the transaction
                this.web3.eth.sendSignedTransaction(raw, (err, txHash) => {
                    console.log('after signing Tx addAddress');
                    resolve();
                    // Now go check etherscan to see the transaction!
                });
            });
        });
    }
}
