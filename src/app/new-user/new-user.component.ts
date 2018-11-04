import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '../../../node_modules/@angular/router';
import { BuyersService } from '../buyers.service';
import { IdentityService } from '../services/identity.service';
import { UtilsService } from '../services/utils.service';
import { WEB3 } from '../web-token/web3-token';
import * as Web3 from 'web3';
import * as ethUtil from 'ethereumjs-util';
import * as namehash from 'eth-ens-namehash';
import { EnsService } from '../services/ens.service';
import { WalletService } from '../services/wallet.service';
import { HttpClient } from '@angular/common/http';
import { EmployeeResolverService } from '../services/employee-resolver.service';
import { SwarmService } from '../services/swarm.service';

@Component({
    selector: 'app-new-user',
    templateUrl: './new-user.component.html',
    styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

    public id: string;
    public ensPrefix: string;

    public providerLoading = false;
    public provideFound = false;
    public provider: string;
    public name: string;

    constructor(public route: ActivatedRoute, public buyersService: BuyersService, public router: Router,
        public identity: IdentityService, public util: UtilsService, @Inject(WEB3) public web3: Web3,
        public ens: EnsService, public wallet: WalletService, private http: HttpClient,
        public emplyeeResolver: EmployeeResolverService, public swarm: SwarmService) {
        this.id = this.route.snapshot.paramMap.get('id');
        console.log(this.buyersService.getBuyers());
    }

    public chooseProvider(provider: string) {
        this.providerLoading = true;
        setTimeout(() => {
            this.providerLoading = false;
            this.provideFound = true;
            this.name = 'Steven Dunham';
            this.provider = provider;
        }, 2000);
    }

    public async setUser() {
        const account1 = '0xbc7C268644a3963CFabc00845430cc29612fb061'; // Your account address 1
        const topicAscii = 'dupa2';
        const withoutPadding = this.web3.utils.asciiToHex(topicAscii);
        const topic = withoutPadding.padEnd(66, '0');
        console.log('requesting txCount');
        await this.web3.eth.getTransactionCount(account1, async (err, txCount) => {
            console.log('txCount: ', txCount);
            await this.sign(this.web3.eth.defaultAccount, txCount);
            console.log('signed');
            const setOwnerDef = this.ens.contract.methods.setOwner(
                namehash.hash(`${this.ensPrefix}.consensys.eth`),
                this.web3.eth.defaultAccount
            );
            await this.util.sendAsOwner(setOwnerDef, '0xa5488b50a6ee97a5e2b7ef0981477fb76b2e7280', txCount + 1);
            console.log('setOwner done');
            const changeLimitDef = this.wallet.contract.methods.changeLimit(
                this.web3.eth.defaultAccount,
                this.web3.utils.toWei('20', 'ether')
            );
            await this.util.sendAsOwner(changeLimitDef, '0x095344a347a28f5e26438f1ca00772b1c33bdda9', txCount + 2);
            console.log('changeLimitDef done');

            await this.swarm.addToSwarm(this.name, this.web3.eth.defaultAccount, txCount + 3);
            // await this.swarm.createFeed(topic, this.web3.eth.defaultAccount, topicAscii, txCount + 3);

            // await this.swarm.updateFeed(this.web3.eth.defaultAccount, topic, this.name);

            // this.http.post<string>(
            //     `http://localhost:8500/bzz-feed:/?topic=${topic}&user=${this.web3.eth.defaultAccount}&manifest=1`,
            //     {}, {
            //         responseType: 'text' as 'json',
            //     })
            //     .subscribe(result => {
            //         console.log('result: ', result);
            //         console.log('topic: ', topic);
            //         this.emplyeeResolver.addDescription(this.web3.eth.defaultAccount, topicAscii, txCount + 3)
            //             .then(() => {
            //             });
            //     });
            setTimeout(() => {
                this.router.navigateByUrl('/shop');
            }, 1500);
        });
    }

    public async sign(address: string, txCount: string) {
        const timestamp = Math.round((new Date()).getTime() / 1000) - 1;

        const permissionStringApproving = this.web3.utils.soliditySha3(
            'I authorize adding this address to my Identity.',
            '0x2878797211bf7ddd689d158f9796b3e5b1bd3d7f',
            1,
            address,
            timestamp
        );

        const permissionString = this.web3.utils.soliditySha3(
            'I authorize being added to this Identity.',
            '0x2878797211bf7ddd689d158f9796b3e5b1bd3d7f',
            1,
            address,
            timestamp
        );

        const permissionApproving = await this.util.sign(
            permissionStringApproving, '0xbc7C268644a3963CFabc00845430cc29612fb061',
            '33c2c0bfd3194c393f6f2e3f1a7bde5e863a41c9123932b0826404b636d7a52d',
        ) as any;

        const concatenatedSignature = await this.web3.eth.sign(permissionString, address);
        const signature = ethUtil.fromRpcSig(concatenatedSignature);
        // const strippedSignature = ethUtil.stripHexPrefix(concatenatedSignature);
        // const signature = {
        //     r: ethUtil.addHexPrefix(strippedSignature.substr(0, 64)),
        //     s: ethUtil.addHexPrefix(strippedSignature.substr(64, 64)),
        //     v: parseInt(ethUtil.addHexPrefix(strippedSignature.substr(128, 2)), 10) + 27
        // };
        await this.identity.addAddress(
            '0xbc7C268644a3963CFabc00845430cc29612fb061', address,
            [permissionApproving.v, signature.v],
            [permissionApproving.r, signature.r],
            [permissionApproving.s, signature.s],
            [timestamp, timestamp],
            { from: '0xbc7C268644a3963CFabc00845430cc29612fb061' }
        );
    }

    ngOnInit() {
    }

}
