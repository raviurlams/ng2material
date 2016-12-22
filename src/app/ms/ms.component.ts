import { Component, OnInit, ViewEncapsulation, Pipe, PipeTransform } from '@angular/core';
import { FormGroup, FormControl,FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

//import {FilterArrayPipe} from '../filter.pipe';

import { ContactServiceService } from '../contact-service.service';
import { ValidationService } from '../validation-service';
import { Member } from './member';


@Component({   
    selector: 'app-ms',
    templateUrl: './ms.component.html',
    encapsulation: ViewEncapsulation.None
})
export class MsComponent implements OnInit {
    public activeLinkIndex: any = 0;
    public customersDatasource: any = [];
    dialogRef: MdDialogRef < billingInfoDialog > ;
    public memberForm: FormGroup;
    public selectedcontact: any;
    public submitted: boolean;
    public componentType: any;
    public componentName: any;
    status: string = '';

    constructor(public dialog: MdDialog, public contactService: ContactServiceService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
        let contactId = +this.route.snapshot.params['id'];
        this.activeLinkIndex = +this.route.snapshot.params['tabIndex'];
        if (contactId) {
            this.showContactInfo(contactId);
        }
        this.customersDatasource = this.contactService.customersDatasource;
    }
    ngOnInit() {
        this.memberForm = this.fb.group({
            id: [''],
            fname: ['', [ < any > Validators.required, < any > Validators.maxLength(50)]],
            lname: ['', [ < any > Validators.required, < any > Validators.maxLength(50)]],
            billingaddresses: this.fb.array([
                this.initAddress(),
            ]),
            mailingaddresses: this.fb.array([
                this.initAddress(),
            ]),
            domicileaddresses: this.fb.array([
                this.initAddress(),
            ]),
            testaddresses: this.fb.array([
                this.initTestAddress()                
            ])


        });
    }
    initTestAddress() {
        return this.fb.group({
            addressType: ['', [ < any > Validators.required]],
            contacts: this.fb.group({
                name: ['', [ < any > Validators.required]],
                phone: ['', [ < any > Validators.required, ValidationService.phoneNumberValidator]]
            })
        });
        //return ['', [ < any > Validators.required]]
    }
    addtest(){
       const control = < FormArray > this.memberForm.controls['testaddresses'];
       control.push(this.initTestAddress());
    }
    save(model: Member, isValid: boolean) {
        this.submitted = true;
        if (isValid) {
            this.selectedcontact.name.fname = model.fname;
            this.selectedcontact.name.lname = model.lname;
            for (var temp = 0; temp < this.selectedcontact.addresses.length; temp++) {
                let obj = this.selectedcontact.addresses[temp];
                if (obj.addressType == 'billing') {
                    obj.phy = model.billingaddresses;
                } else if (obj.addressType == 'mailing') {
                    obj.phy = model.mailingaddresses;
                } else if (obj.addressType == 'domicile') {
                    obj.phy = model.domicileaddresses;
                }
            }
            console.log(" final data ", this.selectedcontact);
            this.contactService.save(this.selectedcontact).subscribe((contact: any) => {
                console.log(contact);
            });
        }

    };
    showContactInfo(contactid: any) {
        let self = this;
        this.contactService.get(contactid)
            .subscribe((contact: any) => {
                if (contact) {
                    self.selectedcontact = contact;
                    this.memberForm.controls['id'].setValue('Custmor  : ' + contact.customerNbr + ' ( ' + contact.path[0] + ' / ' + contact.path[1] + ' / ' + contact.path[2] + ' )', { onlySelf: true });
                    this.memberForm.controls['fname'].setValue(contact.name.fname, { onlySelf: true });
                    this.memberForm.controls['lname'].setValue(contact.name.lname, { onlySelf: true });

                    if (contact.addresses.length > 0) {
                        for (let adressCntr = 0; adressCntr < contact.addresses.length; adressCntr++) {
                            var addressObj = contact.addresses[adressCntr];
                            if (addressObj.addressType.toUpperCase() == 'BILLING' && addressObj.phy.length > 0) {
                                this.genarateAddressFormComponents('billingaddresses', addressObj.phy);
                                this.fillAddressFormDetails('billingaddresses', addressObj.phy);
                            } else if (addressObj.addressType.toUpperCase() == 'MAILING' && addressObj.phy.length > 0) {
                                this.genarateAddressFormComponents('mailingaddresses', addressObj.phy);
                                this.fillAddressFormDetails('mailingaddresses', addressObj.phy);
                            } else if (addressObj.addressType.toUpperCase() == 'DOMICILE' && addressObj.phy.length > 0) {
                                this.genarateAddressFormComponents('domicileaddresses', addressObj.phy);
                                this.fillAddressFormDetails('domicileaddresses', addressObj.phy);
                            }
                        }
                    }
                }
            });
    };
    genarateAddressFormComponents(type: any, data: any) {
        const addrectrl = < FormArray > this.memberForm.controls[type];
        for (var temp = 0; temp < addrectrl.length; temp++) {
            this.removeAddress(temp, type);
        }
        for (let i = 0; i < data.length; i++) {
            const addctrl = < FormArray > this.memberForm.controls[type];
            if (data.length == addctrl.length) {
                break;
            }
            this.addAddress(type);
        }
    };
    fillAddressFormDetails(type: any, data: any) {
        for (let ctrl = 0; ctrl < data.length; ctrl++) {
            const addresscontrol = < FormArray > this.memberForm.controls[type];
            const eachcontrol = < FormArray > addresscontrol.controls[ctrl];
            eachcontrol.controls['nbr'].setValue(data[ctrl].nbr, { onlySelf: true });
            eachcontrol.controls['city'].setValue(data[ctrl].city, { onlySelf: true });
            eachcontrol.controls['street'].setValue(data[ctrl].street, { onlySelf: true });
            eachcontrol.controls['state'].setValue(data[ctrl].state, { onlySelf: true });
            eachcontrol.controls['zip'].setValue(data[ctrl].zip, { onlySelf: true });
            eachcontrol.controls['country'].setValue(data[ctrl].country, { onlySelf: true });
        }
    };
    initAddress() {
        return this.fb.group({
            nbr: ['', [ < any > Validators.required, < any > Validators.maxLength(50), ValidationService.numberValidator]],
            street: ['', [ < any > Validators.required, < any > Validators.maxLength(50)]],
            city: ['', [ < any > Validators.required, < any > Validators.maxLength(50)]],
            state: ['', [ < any > Validators.required, < any > Validators.maxLength(50)]],
            country: ['', [ < any > Validators.required, < any > Validators.maxLength(50)]],
            zip: ['', [Validators.required, < any > Validators.maxLength(10), ValidationService.zipCodeValidator]]
        });
    };
    addAddress(type: any) {
        const control = < FormArray > this.memberForm.controls[type];
        control.push(this.initAddress());
    };
    removeAddress(index: any, type: any) {
        const control = < FormArray > this.memberForm.controls[type];
        control.removeAt(index);

    };
    resetAddress() {
        if (this.selectedcontact) {
            for (let adressCntr = 0; adressCntr < this.selectedcontact.addresses.length; adressCntr++) {
                this.selectedcontact.addresses[adressCntr].phy = [];
            }
        }

        this.selectedcontact = this.contactService.getDefaultContact();
        this.memberForm.controls['id'].setValue('', { onlySelf: true });
        this.memberForm.controls['fname'].setValue('', { onlySelf: true });
        this.memberForm.controls['lname'].setValue('', { onlySelf: true });

        const addrectrl = < FormArray > this.memberForm.controls['billingaddresses'];
        for (let temp = addrectrl.controls.length; temp--;) {
            this.removeAddress(temp, 'billingaddresses');
        }
        const mailingctrl = < FormArray > this.memberForm.controls['mailingaddresses'];
        for (let temp = mailingctrl.controls.length; temp--;) {
            this.removeAddress(temp, 'mailingaddresses');
        }
        const demicictrl = < FormArray > this.memberForm.controls['domicileaddresses'];
        for (let temp = demicictrl.controls.length; temp--;) {
            this.removeAddress(temp, 'domicileaddresses');
        }
        this.addAddress('billingaddresses');
        this.addAddress('mailingaddresses');
        this.addAddress('domicileaddresses');

        this.contactService.getSeq()
            .subscribe((id: any) => {
                this.selectedcontact.customerNbr = id;
                this.memberForm.controls['id'].setValue(id, { onlySelf: true });
            });
    };
    open(type: any, component: any) {
        this.dialogRef = this.dialog.open(billingInfoDialog);
        this.componentType = type;
        this.componentName = component;

        this.dialogRef.afterClosed().subscribe(result => {
            if (this.selectedcontact.addresses) {
                for (let adressCntr = 0; adressCntr < this.selectedcontact.addresses.length; adressCntr++) {
                    var addressObj = this.selectedcontact.addresses[adressCntr];
                    if (addressObj.addressType.toUpperCase() == this.componentType.toUpperCase()) {
                        var duplictaeRef = false;
                        for (let ctr = 0; ctr < addressObj.phy.length; ctr++) {
                            if (result.value) {
                                duplictaeRef = true;
                            } else {
                                if (addressObj.phy[ctr].stNbr == result.stNbr) {
                                    duplictaeRef = true;
                                    break;
                                }
                            }
                        }
                        if (!duplictaeRef) {
                            addressObj.phy.push(result);
                            const control = < FormArray > this.memberForm.controls[this.componentName];
                            control.push(this.fb.group({
                                nbr: [result.stNbr, [ < any > Validators.required, < any > Validators.maxLength(50), ValidationService.numberValidator]],
                                street: [result.stName, [ < any > Validators.required, < any > Validators.maxLength(50)]],
                                city: [result.city, [ < any > Validators.required, < any > Validators.maxLength(50)]],
                                state: [result.state, [ < any > Validators.required, < any > Validators.maxLength(50)]],
                                country: [result.country, [ < any > Validators.required, < any > Validators.maxLength(50)]],
                                zip: [result.zip, [Validators.required, < any > Validators.maxLength(10), ValidationService.zipCodeValidator]]
                            }));
                        }

                    }
                }
            }
            //result.value
            this.dialogRef = null;
        });
    };
    formatePhno(control: FormControl) {

        if (control.errors == null) {
            let value = control.value;
            var country, city, number;

            switch (value.length) {
                case 10: // +1PPP####### -> C (PPP) ###-####
                    country = 1;
                    city = value.slice(0, 3);
                    number = value.slice(3);
                    break;

                case 11: // +CPPP####### -> CCC (PP) ###-####
                    country = value[0];
                    city = value.slice(1, 4);
                    number = value.slice(4);
                    break;

                case 12: // +CCCPP####### -> CCC (PP) ###-####
                    country = value.slice(0, 3);
                    city = value.slice(3, 5);
                    number = value.slice(5);
                    break;

                default:
                    return value;
            }

            if (country == 1) {
                country = "";
            }

            number = number.slice(0, 3) + '-' + number.slice(3);
            number = (country + " (" + city + ") " + number).trim();
            control.setValue(number, { emitViewToModelChange: true });
        }
    };
}

@Component({
    templateUrl: './ms.billingInfo.html'
})
export class billingInfoDialog {
    public addressDatasource: any = [];
    public addForm: FormGroup;
    constructor(public dialogRef: MdDialogRef < billingInfoDialog > , public contactService: ContactServiceService, private fb: FormBuilder) {
        let self = this;
        this.contactService.getAddContacts()
            .subscribe((address: any) => {
                self.addressDatasource = address;
            });

        this.addForm = this.fb.group({
            nbr: ['', [ < any > Validators.maxLength(50), ValidationService.numberValidator]],
            street: ['', [ < any > Validators.maxLength(50)]],
            city: ['', [ < any > Validators.maxLength(50)]],
            state: ['', [ < any > Validators.maxLength(50)]],
            country: ['', [ < any > Validators.maxLength(50)]],
            zip: ['', [ < any > Validators.maxLength(10), ValidationService.zipCodeValidator]]
        });
    }
}
