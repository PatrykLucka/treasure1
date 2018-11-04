import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BuyersService {

    public loggedUser: any;
    public selectedUser: string;

    public users = [];

    public getBuyers() { console.log('buyers: ', this.users); return this.users; }
    public getLoggedUser() { return this.users.find(item => item.id === this.loggedUser); }
    public login(ensPrefix) { this.loggedUser = this.users.find(item => item.ensPrefix === ensPrefix).id; return this.loggedUser; }
    public buy(value) {
        this.users = this.users.map(item => {
            if (item.id === this.loggedUser) {
                return {
                    ...item,
                    spent: item.spent + value,
                };
            }
            return item;
        });
    }

    public addBuyer(buyer: any) {
        const newGuid = this.guid();
        this.users.push({
            id: newGuid,
            spent: 0,
            ...buyer
        });
        return newGuid;
    }
    public editBuyer(buyer: any) {
        this.users = this.users.map(item => {
            if (item.id === buyer.id) {
                return buyer;
            }
            return item;
        });
    }
    public setBuyer(id: string, ensPrefix: string, name: string) {
        this.users = this.users.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    ensPrefix: ensPrefix,
                    name: name,
                };
            }
            return item;
        });
    }
    public select(buyer: any) {
        this.users = this.users.map(el => ({
            ...el,
            selected: el.name === buyer.name,
        }));
    }
    public unselect() {
        this.users = this.users.map(el => ({
            ...el,
            selected: false,
        }));
    }
    public remove(buyer: any) {
        this.users = this.users.filter(el => el.id !== buyer.id);
    }

    private guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    constructor() { }
}
