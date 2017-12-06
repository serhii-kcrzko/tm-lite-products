import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Customer } from './item.interface';

import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import _forEach from 'lodash/foreach';
import _locate from 'lodash/find';

import { BackendService } from '../backend.service';

@Component({
  selector: 'app-item-add',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.css']
})
export class ItemAddComponent implements OnInit {
  public myForm: FormGroup;
  public rawsOptions: any;

  constructor(private _fb: FormBuilder, private db: BackendService, private http: Http) { }

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

    this.getRaws();
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
}
