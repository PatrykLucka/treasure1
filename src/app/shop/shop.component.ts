import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { BuyersService } from '../buyers.service';
import { WalletService } from '../services/wallet.service';
import { WEB3 } from '../web-token/web3-token';
import * as Web3 from 'web3';
import { SwarmService } from '../services/swarm.service';
import { EmployeeResolverService } from '../services/employee-resolver.service';

@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

    public items = [
        { imgUrl: '../../assets/bigger-flower.png', name: 'Big flower', price: 1, bought: false },
        { imgUrl: '../../assets/computer.png', name: 'Computer', price: 2, bought: false },
        { imgUrl: '../../assets/flower.png', name: 'Flower', price: 0.5, bought: false },
        { imgUrl: '../../assets/lamp.png', name: 'Lamp', price: 0.7, bought: false },
        { imgUrl: '../../assets/picture.png', name: 'Picture', price: 0.2, bought: false },
        { imgUrl: '../../assets/shelf.png', name: 'Shelf', price: 1, bought: false },
    ];

    public bought = [];
    public user: any;

    constructor(public buyersService: BuyersService, public wallet: WalletService, public changeDetector: ChangeDetectorRef,
        @Inject(WEB3) public web3: Web3, public swarm: SwarmService, public employeeResolver: EmployeeResolverService) {
        console.log('defaultAddress: ', this.web3.eth.defaultAddress);

        this.wallet.getUserData(this.web3.eth.defaultAddress)
            .then(data => {
                this.web3.eth.getAccounts()
                    .then((accounts) => {
                        this.employeeResolver.getDescription(accounts[0])
                            .then((feed) => {
                                console.log('feed: ', feed);
                                this.swarm.getFromSwarm(feed.substr(2))
                                    .then((name) => {
                                        console.log('name: ', name);
                                        this.user = {
                                            spent: parseInt(data['0'], 10),
                                            limit: parseInt(data['1'], 10),
                                            name: name,
                                        };
                                    });
                            });
                    });
            });
    }

    public async buy(item) {
        if ((this.user.limit - this.user.spent) < item.price) {
            item.bought = 'error';
            setTimeout(() => {
                item.bought = false;
            }, 2000);
        } else {
            item.bought = true;
            this.wallet.executeSignedTransaction(item.price)
                .then(() => {
                    this.user.spent += (item.price * 1000000000000000000);
                    this.changeDetector.detectChanges();
                });
        }
    }

    ngOnInit() {
    }

}
