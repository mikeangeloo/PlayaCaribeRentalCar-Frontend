import { Component, OnInit } from '@angular/core';
import {GeneralService} from '../../services/general.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  constructor(
    public generalServ: GeneralService
  ) { }

  ngOnInit() {}

}
