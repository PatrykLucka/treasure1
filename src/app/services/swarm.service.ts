import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EmployeeResolverService } from './employee-resolver.service';
import { WEB3 } from '../web-token/web3-token';
import * as Web3 from 'web3';
import { UtilsService } from './utils.service';

@Injectable({
    providedIn: 'root'
})
export class SwarmService {

    constructor(public http: HttpClient, public employeeResolver: EmployeeResolverService,
        @Inject(WEB3) public web3: Web3, public utils: UtilsService, public emplyeeResolver: EmployeeResolverService) { }

    public addToSwarm(data: string, address, nonce) {
        this.http.post<string>('http://localhost:8500/bzz:/', data, {
            headers: new HttpHeaders({ 'Content-Type': 'plain/text' }),
            responseType: 'text' as 'json',
        }).subscribe(result => {
            console.log('jaki result! ', result.toString());
            this.employeeResolver.addDescription(address, '0x' + result.toString(), nonce);
        });
    }

    public getFromSwarm(data) {
        return new Promise((resolve, reject) => {
            this.http.get<string>('http://localhost:8500/bzz:/' + data, {
                responseType: 'text' as 'json',
            }).subscribe(result => {
                console.log('reponse result! ', result.toString());
                resolve(result);
            });
        });
    }



    //     public createFeed(topic, address, topicAscii, txCount) {
    //         this.http.post<string>(
    //             `http://localhost:8500/bzz-feed:/?topic=${topic}&user=${address}&manifest=1`,
    //             {}, {
    //                 responseType: 'text' as 'json',
    //             })
    //             .subscribe(result => {
    //                 console.log('result: ', result);
    //                 console.log('topic: ', topic);
    //                 this.employeeResolver.addDescription(address, topicAscii, txCount);
    //             });
    //     }

    //     public async updateFeed(address, topic, data: string) {
    //         const time = new Date().getTime();
    //         const encodedData = new Uint8Array(this.rawStringToBuffer(data));
    //         // const encodedData = new Uint8Array([5, 154, 15, 165, 62]);
    //         // const encodedData = new Blob([data], {type: 'text/plain'});
    //         const hashed = this.feedUpdateDigest(topic, address, time, new Uint8Array(this.rawStringToBuffer(data)));
    //         const signature = await this.web3.eth.sign(hashed, address);
    //         console.log('signature: ', signature.substr(2));
    //         console.log('hashed: ', hashed);

    //         this.http.post<string>(
    // `http://localhost:8500/bzz-feed:/?topic=${topic}&user=${address}&level=25&time=${time}&protocolVersion=0&signature=${signature.substr(2)}`,
    //             encodedData, {
    //                 headers: new HttpHeaders({ 'Content-Type': 'application/octet-stream' }),
    //                 responseType: 'text' as 'json',
    //             })
    //             .subscribe(result => {
    //                 console.log('result update-feed: ', result);
    //                 // this.employeeResolver.addDescription(address, topicAscii, txCount + 3);
    //             });
    //     }

    //     public async getFeed(topic, address) {
    //         return new Promise((resolve, reject) => {
    //             const withoutPadding = this.web3.utils.asciiToHex(topic);
    //             const realTopic = withoutPadding.padEnd(66, '0');
    //             this.http.get<string>(
    //                 `http://localhost:8500/bzz-feed:/?topic=${realTopic}&user=${address}`, {
    //                 responseType: 'text' as 'json',
    //             })
    //             .subscribe(result => {
    //                 console.log('result get-feed: ', result);
    //                 resolve(result);
    //                 // this.employeeResolver.addDescription(address, topicAscii, txCount + 3);
    //             });
    //         });
    //     }


    //     public feedUpdateDigest(topic, user, time, data /*UInt8Array*/) {
    //         const topicLength = 32;
    //         const userLength = 20;
    //         const timeLength = 7;
    //         const levelLength = 1;
    //         const headerLength = 8;
    //         const updateMinLength = topicLength + userLength + timeLength + levelLength + headerLength;
    //         let topicBytes;
    //         let userBytes;
    //         const protocolVersion = 0;

    //         try {
    //             topicBytes = this.web3.utils.hexToBytes(topic);
    //         } catch (err) {
    //             console.error('topicBytes: ' + err);
    //             return undefined;
    //         }

    //         try {
    //             userBytes = this.web3.utils.hexToBytes(user);
    //         } catch (err) {
    //             console.error('topicBytes: ' + err);
    //             return undefined;
    //         }

    //         const buf = new ArrayBuffer(updateMinLength + data.length);
    //         const view = new DataView(buf);
    //         let cursor = 0;

    //         view.setUint8(cursor, protocolVersion); // first byte is protocol version.
    //         cursor += headerLength; // leave the next 7 bytes (padding) set to zero

    //         topicBytes.forEach(function (v) {
    //             view.setUint8(cursor, v);
    //             cursor++;
    //         });

    //         userBytes.forEach(function (v) {
    //             view.setUint8(cursor, v);
    //             cursor++;
    //         });

    //         // time is little-endian
    //         view.setUint32(cursor, time, true);
    //         cursor += 7;

    //         view.setUint8(cursor, 25);
    //         cursor++;

    //         data.forEach(function (v) {
    //             view.setUint8(cursor, v);
    //             cursor++;
    //         });

    //         return this.web3.utils.sha3(this.web3.utils.bytesToHex(new Uint8Array(buf)));
    //     }

    //     private rawStringToBuffer( str ) {
    //         let idx;
    //         const len = str.length, arr = new Array( len );
    //         for ( idx = 0 ; idx < len ; ++idx ) {
    //             // tslint:disable-next-line:no-bitwise
    //             arr[ idx ] = str.charCodeAt(idx) & 0xFF;
    //         }
    //         // You may create an ArrayBuffer from a standard array (of values) as follows:
    //         return new Uint8Array( arr ).buffer;
    //     }

}
