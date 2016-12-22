import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/switchMap';

import { ContactServiceService } from '../contact-service.service';

@Component({
  selector: 'app-maddress',
  templateUrl: './maddress.component.html',
  styleUrls: ['./maddress.component.css'],
  providers: [ContactServiceService]
})
export class MaddressComponent implements OnInit {

  constructor(private addrService: ContactServiceService) { }

  ngOnInit() {
    this.getmAddress();
  }

public mAddress: any = [];
 

 getmAddress() {
        
        this.addrService.getmAddress()
            .subscribe((mAddress: any) => {
                this.mAddress = mAddress;
            });
    }


}
