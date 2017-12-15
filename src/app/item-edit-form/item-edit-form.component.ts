import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Http } from '@angular/http';
import _forEach from 'lodash/forEach';
import _filter from 'lodash/filter';
import _locate from 'lodash/find';
import _reduce from 'lodash/reduce';
import _round from 'lodash/round';
import _flatten from 'lodash/flatten';

import { BackendService } from '../backend.service';

@Component({
  selector: 'app-item-edit-form',
  templateUrl: './item-edit-form.component.html',
  styleUrls: ['./item-edit-form.component.css']
})
export class ItemEditFormComponent implements OnInit {
  public editForm: FormGroup;
  public rawsOptions: any;
  public product;
  public id: string;
  public article: AbstractControl;
  public name: AbstractControl;
  public lift: AbstractControl;
  public liftVal = 1;
  public ingridients: AbstractControl;
  public currentPrice = 0;
  public cost = 0;
  private saved = false;

  constructor(
    private _fb: FormBuilder,
    private db: BackendService,
    private http: Http,
    private route: ActivatedRoute,
    private location: Location) {
    route.params.subscribe(params => { this.id = params['id']; });

    this.editForm = this._fb.group({
      article: ['', [Validators.required, Validators.minLength(5)]],
      name: ['', [Validators.required]],
      lift: ['', [Validators.required]],
      ingridients: this._fb.array([])
    });

    this.article = this.editForm.controls['article'];
    this.name = this.editForm.controls['name'];
    this.lift = this.editForm.controls['lift'];
    this.ingridients = this.editForm.controls['ingridients'];
  }

  ngOnInit() {
    this.getRaws();

    this.db
      .getProduct(this.id)
      .subscribe((res: any) => {
        this.product = res;
        this.liftVal = this.product.lift;
        this.currentPrice = this.product.currentPrice;
        this.cost = this.product.cost;

        for (const i of this.product.ingridients) {
          this.addIngridient(i);
        }
      });
  }

  initIngridient(item?: any) {
    return this._fb.group({
      raw: ['' + (item !== null ? item.raw : ''), Validators.required],
      quantity: ['' + (item !== null ? item.quantity : ''), Validators.required],
      name: ['' + (item !== null ? item.name : '')],
      price: ['' + (item !== null ? item.price : '')]
    });
  }

  addIngridient(value?: any) {
    const control = <FormArray>this.editForm.controls['ingridients'];
    control.push(this.initIngridient(value || null));
  }

  removeIngridient() {
    const list = _filter(this.editForm.value.ingridients, i => i.quantity !== '');
    this.editForm.value.ingridients = list;
  }

  save() {
    this.initializeNames();
    this.calculatePrice();
    this.saved = true;
    this.editForm.value.price = this.currentPrice.toFixed(2);
    this.editForm.value.cost = this.cost.toFixed(2);
    this.db.updateItem(this.id, this.editForm.value)
      .subscribe((data) => {
        this.saved = false;
        this.location.back();
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
    this.editForm.value.id = this.id;
    this.editForm.value.article = this.editForm.value.article !== '' ? this.editForm.value.article : this.product.article;
    this.editForm.value.name = this.editForm.value.name !== '' ? this.editForm.value.name : this.product.name;
    this.editForm.value.lift = this.editForm.value.lift !== '' ? this.editForm.value.lift : this.product.lift;
  }

  find(field: string, value: string): any {
    const json = _locate(this.rawsOptions, obj => obj[field] === value);
    return json;
  }

  calculatePrice() {
    const ingridients = _filter(this.editForm.value.ingridients, obj => obj.raw !== '');
    const items = _flatten(ingridients);

    if (items.length && items[0].raw !== '') {
      const cost = _reduce(items, (sum, item) => {
        const raw = this.find('id', item.raw);
        return sum + (+raw.actualPrice * +item.quantity);
      }, 0);
      this.cost = cost;
      this.currentPrice = cost * +this.liftVal;
    }
  }
}
