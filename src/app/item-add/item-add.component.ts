import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Customer } from './item.interface';

import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import _forEach from 'lodash/forEach';
import _locate from 'lodash/find';
import _filter from 'lodash/filter';
import _reduce from 'lodash/reduce';
import _round from 'lodash/round';

import { BackendService } from '../backend.service';

@Component({
  selector: 'app-item-add',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.css']
})
export class ItemAddComponent implements OnInit {
  addForm: FormGroup;
  rawsOptions: any;
  article: AbstractControl;
  name: AbstractControl;
  lift: AbstractControl;
  ingridients: AbstractControl;
  currentPrice = 0;
  saved = false;

  constructor(private _fb: FormBuilder, private db: BackendService, private http: Http) {
    this.addForm = this._fb.group({
      article: ['', [Validators.required, Validators.minLength(8)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      lift: ['1', [Validators.required, Validators.minLength(1)]],
      ingridients: this._fb.array([
        this.initIngridient(),
      ])
    });

    this.article = this.addForm.controls['article'];
    this.name = this.addForm.controls['name'];
    this.lift = this.addForm.controls['lift'];
    this.ingridients = this.addForm.controls['ingridients'];
  }

  ngOnInit() {
    this.getRaws();
  }

  initIngridient() {
    return this._fb.group({
      raw: ['', Validators.required],
      quantity: ['', Validators.required],
      name: ['']
    });
  }

  calculatePrice() {
    const items = _filter(this.ingridients.value, obj => obj.raw !== '');
    if (items.length && items[0].raw !== '') {
      const cost = _reduce(items, (sum, obj) => {
        const item = this.find('id', obj.raw);
        return sum + (+item.actualPrice * +obj.quantity);
      }, 0);
      this.currentPrice = cost * +this.lift.value;
    }
  }

  addIngridient() {
    const control = <FormArray>this.ingridients;
    control.push(this.initIngridient());
    this.calculatePrice();
  }

  removeIngridient(i: number) {
    const control = <FormArray>this.ingridients;
    control.removeAt(i);
    this.calculatePrice();
  }

  save() {
    this.initializeNames();
    this.addForm.value.price = this.getPrice();
    this.addForm.value.cost = this.getCost();
    this.saved = true;
    this.db.putItem(this.addForm.value)
      .subscribe((data) => {
        this.addForm.reset();
        this.saved = false;
      });
  }

  getData() {
    return this.db.getRaws();
  }

  getRaws() {
    this.getData().subscribe(data => {
      this.rawsOptions = data;
    });
  }

  initializeNames(): void {
    _forEach(this.addForm.value.ingridients, i => {
      const rawOption = this.find('id', i.raw);
      i.name = rawOption.name;
      i.price = rawOption.actualPrice;
    });
  }


  find(field: string, value: string): any {
    const json = _locate(this.rawsOptions, obj => obj[field] === value);
    return json;
  }

  getPrice() {
    const price = _round(this.currentPrice, 2);
    return price.toFixed(2);
  }

  getCost() {
    const cost = _round(this.currentPrice / this.lift.value, 2);
    return cost.toFixed(2);
  }
}

