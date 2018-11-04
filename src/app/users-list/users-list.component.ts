import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BuyersService } from '../buyers.service';
import { Observable } from 'rxjs';
import { IdentityService } from '../services/identity.service';
import { WEB3 } from '../web-token/web3-token';
import * as Web3 from 'web3';

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

    public id: string;
    public email: string;
    public name: string;
    public limit: number;
    public accessLimit: number;
    public ensPrefix: string;
    public spent: number;
    public selectedDrop: string;

    public walletBalance: any;
    public addWallet = false;
    public walletName: string;
    public walletLimit: number;

    public users: any;
    public users$: Observable<any[]>;

    public selected = false;
    public selectedUser: any;
    public new = true;
    public newGuid: string;

    public JSON: any;

    constructor(public buyersService: BuyersService, @Inject(WEB3) public web3: Web3,
        public identity: IdentityService) {
        this.users = buyersService.getBuyers();
        this.users$ = identity.getBuyers();
        this.web3.eth.getBalance('0x095344a347a28f5e26438f1ca00772b1c33bdda9')
            .then((balance) => {
                this.walletBalance = balance / 1000000000000000000;
            });

        this.JSON = JSON;
    }

    add(e, addWallet) {
        e.stopPropagation();
        this.unselect();
        this.new = true;
        this.selected = true;
        this.email = '';
        this.limit = 20;
        this.accessLimit = 365;
        this.selectedDrop = '1';
        this.addWallet = addWallet;
    }

    select(e, item) {
        e.stopPropagation();
        if (item.limit) {
            this.buyersService.select(item);
            this.selectedUser = item;
            this.selected = true;
            this.new = false;
            this.name = item.name;
            this.limit = item.limit;
            this.id = item.id;
            this.ensPrefix = item.ensPrefix;
            this.spent = item.spent;
            this.users = this.buyersService.getBuyers();
        }
    }

    unselect() {
        this.selected = false;
        this.newGuid = '';
        this.buyersService.unselect();
        this.users = this.buyersService.getBuyers();
    }

    delete(user: any) {
        this.buyersService.remove(user);
        this.users = this.buyersService.getBuyers();
    }

    onSubmit(f: NgForm) {
        if (this.new) {
            this.newGuid = this.buyersService.addBuyer({ limit: this.limit, selected: false });
        } else {
            this.buyersService.editBuyer({
                id: this.id,
                spent: this.spent,
                ensPrefix: this.ensPrefix,
                limit: this.limit,
                name: this.name,
                selected: false,
            });
            this.unselect();
        }
        this.users = this.buyersService.getBuyers();
    }

    preventUnselect(e) {
        e.stopPropagation();
    }

    ngOnInit() {
    }

}
