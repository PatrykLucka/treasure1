import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-send-form',
    templateUrl: './send-form.component.html',
    styleUrls: ['./send-form.component.css']
})
export class SendFormComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

    onSubmit(f: NgForm) {
        console.log(f.value);
    }

}
