import { Component, Inject } from '@angular/core';
import { WEB3 } from './web-token/web3-token';
import * as Web3 from 'web3';
import { IdentityService } from './services/identity.service';
import { CompanyResolverService } from './services/company-resolver.service';
import { EmployeeResolverService } from './services/employee-resolver.service';
import { WalletService } from './services/wallet.service';
import { EnsService } from './services/ens.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'pegasys-hack';
    web3ProviderMissing = false;
    accounts: any[];

    constructor(@Inject(WEB3) public web3: Web3,
        public identity: IdentityService,
        public companyResolver: CompanyResolverService,
        public employeeResolver: EmployeeResolverService,
        public wallet: WalletService,
        public ens: EnsService) {
        if (!this.web3.currentProvider) {
            this.web3ProviderMissing = true;
        } else {
            if ((<any>window).ethereum) {
                (<any>window).ethereum.enable();
            }
            this.updateAccounts();
            setInterval(() => {
                this.updateAccounts();
            }, 1000);
        }

        this.web3.eth.getAccounts()
            .then(((accounts) => {
                this.web3.eth.defaultAccount = accounts[0];
                console.log('my address: ', accounts[0]);
                this.identity.getDetails();
                this.identity.checkIfExists();
                // this.identity.getEIN();
                this.companyResolver.setContract('0x824092300a4c47be51d3f97b41e6f29aefd75935');
                this.employeeResolver.setContract('0x62aea79985692570662fd69883abb2b18fd2afd9');
                this.wallet.setContract('0x095344a347a28f5e26438f1ca00772b1c33bdda9');
                this.ens.setContract('0xa5488b50a6ee97a5e2b7ef0981477fb76b2e7280');
                setTimeout(() => {
                    this.ens.getAddress('consensys.eth');
                    this.ens.getAddress('owner.consensys.eth');
                }, 1000);
            }));
    }

    updateAccounts() {
        this.web3.eth.getAccounts()
            .then(((accounts) => {
                // console.log('account:', accounts);
                this.web3.eth.defaultAccount = accounts[0];
                // this.accounts = accounts.map((item) => {
                //     this.web3.eth.getBalance(item).then(balance => {
                //         this.accounts = this.accounts.map(el => {
                //             if (el.address === item) {
                //                 return {
                //                     ...el,
                //                     balance: this.web3.utils.fromWei(balance.toString(), 'ether'),
                //                 };
                //             }
                //             return el;
                //         });
                //     });
                //     return {
                //         address: item,
                //     };
                // });
            }));
    }


}
