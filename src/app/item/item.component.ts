import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { BackendService } from '../backend.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  id: string;
  product: Object;
  options: Object;

  constructor(private route: ActivatedRoute, private db: BackendService, private location: Location) {
    route.params.subscribe(params => { this.id = params['id']; });
  }

  ngOnInit(): void {
    this.db
      .getProduct(this.id)
      .subscribe((res: any) => {
        this.renderProduct(res);
      });
  }

  back(): void {
    this.location.back();
  }

  renderProduct(res: any): void {
    this.product = res;
    this.options = {
      title: { text: 'Ретроспектива попиту' },
      series: [{ data: res.needStatistics }],
      xAxis: {
        title: 'Дні'
      },
      yAxis: {
        title: 'Показники'
      },
      legend: {
        enabled: false
      }
    };

    console.log(this.options);
  }

  getVal() {
    return 15;
  }
}
