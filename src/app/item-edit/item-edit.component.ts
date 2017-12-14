import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { BackendService } from '../backend.service';
import { sortBy } from 'lodash/sortBy';
import { Router } from '@angular/router';

import * as moment from 'moment';
import 'moment/locale/uk';
moment.locale('uk');

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css']
})
export class ItemEditComponent implements OnInit {
  data: any = [];

  constructor(private http: Http, private db: BackendService, private router: Router) { }

  getData() {
    return this.db.getProducts();
  }

  getProducts() {
    this.getData().subscribe(res => this.data = res);
  }

  ngOnInit() {
    this.getProducts();
    this.getData();
  }

  parseDate(date: string): string {
    const parsedDate = moment(date);
    return parsedDate.format('D MMMM YYYY, hh:mm:ss');
  }

  capitalize(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getLocation(): string {
    return this.router.url;
  }

  parseUser(email: string): string {
    const login = email.split('@')[0];
    const userName = login.split('.');
    const [name, surname] = userName;
    return `${this.capitalize(name)} ${this.capitalize(surname)}`;
  }

}
