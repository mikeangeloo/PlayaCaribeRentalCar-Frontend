import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-edit-cat-vehiculo',
  templateUrl: './edit-cat-vehiculo.component.html',
  styleUrls: ['./edit-cat-vehiculo.component.scss'],
})
export class EditCatVehiculoComponent implements OnInit {

  public id = null;
  public ready = false;
  public $actRouteSub = new Subscription();
  constructor(
    private actRoute: ActivatedRoute
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    console.log('enter edit cat vehiculo');

   this.$actRouteSub = this.actRoute.params.subscribe((data) => {
      if (data.id) {
        console.log('id', data.id);
        this.id = data.id;
        this.ready = true;
      }
    })
  }

  ionViewWillLeave() {
    this.$actRouteSub.unsubscribe();
    this.ready = false;
  }

}
