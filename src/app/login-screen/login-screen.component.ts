import { Component } from '@angular/core';
import { BuyersService } from '../buyers.service';
import { Router } from '@angular/router';
import { EnsService } from '../services/ens.service';
import { IdentityService } from 'src/app/services/identity.service';

@Component({
    selector: 'app-login-screen',
    templateUrl: './login-screen.component.html',
    styleUrls: ['./login-screen.component.css']
})

export class LoginScreenComponent {

    public ensPrefix: string;
    constructor(public buyersService: BuyersService,
        public router: Router,
        public identity: IdentityService,
        public ens: EnsService) { }

    public login() {
        this.ens.getAddress(`${this.ensPrefix}.consensys.eth`)
            .then((address) => {
                this.identity.isProvider(address)
                    .then(isProvider => {
                        if (isProvider) {
                            this.router.navigateByUrl('/buyers');
                        } else {
                            this.router.navigateByUrl('/shop');
                        }
                    });
            })
            .catch(err => {
                console.log('err: ', err);
            });
    }
}
