import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Http } from '@angular/http';
import _forEach from 'lodash/foreach';

import { BackendService } from '../backend.service';

@Component({
  selector: 'app-item-edit-form',
  templateUrl: './item-edit-form.component.html',
  styleUrls: ['./item-edit-form.component.css']
})
export class ItemEditFormComponent implements OnInit {
  public myForm: FormGroup;
  public rawsOptions: any;
  public product;
  public id: string;

  constructor(private _fb: FormBuilder, private db: BackendService, private http: Http, private route: ActivatedRoute) {
    route.params.subscribe(params => { this.id = params['id']; });

    this.getRaws();

    this.db
      .getProduct(this.id)
      .subscribe((res: any) => {
        this.initProduct(res);

        console.log(this.product);
        console.log(this.product.ingridients);
      });
  }

  ngOnInit() {
    this.myForm = this._fb.group({
      article: ['', [Validators.required, Validators.minLength(5)]],
      name: ['', [Validators.required]],
      lift: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      ingridients: this._fb.array([
        this.initIngridient(),
      ])
    });
  }

  initProduct(value: any) {
    this.product = value;
  }

  initIngridient() {
    return this._fb.group({
      raw: ['', Validators.required],
      quantity: ['', Validators.required],
      name: ['']
    });
  }

  addIngridient() {
    const control = <FormArray>this.myForm.controls['ingridients'];
    control.push(this.initIngridient());
  }

  removeIngridient(i: number) {
    const control = <FormArray>this.myForm.controls['ingridients'];
    control.removeAt(i);
  }

  save() {
    this.initializeNames();
    this.http.post('http://localhost:9000/products', this.myForm.value)
      .subscribe((data) => this.myForm.reset());
  }

  getData() {
    return this.db.getRaws();
  }

  getRaws() {
    this.getData().subscribe(data => {
      this.rawsOptions = data;
      console.log(data);
    });
  }

  initializeNames(): void {
    _forEach(this.myForm.value.ingridients, i => {
      const id = i.raw.split('-')[0];
      const name = i.raw.split('-')[1];
      i.raw = id;
      i.name = name;
    });
  }

  getProd() {
    return 15;
  }
}
