import { InjectionToken } from '@angular/core';
import * as Web3 from 'web3';

export const WEB3 = new InjectionToken<Web3>('web3', {
    providedIn: 'root',
    factory: () => {
        const w = new Web3(Web3.givenProvider);
        w.bzz.setProvider('http://localhost:8500');
        return w;
    },
});
