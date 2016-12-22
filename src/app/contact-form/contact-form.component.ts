import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ContactServiceService } from '../contact-service.service';
import { ValidationService } from '../validation-service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { Customer } from '../customer';

@Component({
    selector: 'contact-form',
    templateUrl: './contact-form.component.html',
    providers: [ContactServiceService, ValidationService]
})
export class ContactFormComponent implements OnInit {

    public phonesObj: any = [];
    public contact: any = [];
    public contactForm: FormGroup;
    public submitted: boolean;

    constructor(private contactService: ContactServiceService, private fb: FormBuilder, private route: ActivatedRoute,
        private router: Router) {}

    ngOnInit() {
        let contactId = +this.route.snapshot.params['id'];
        this.contactForm = this.fb.group({
            _id: [''],
            customerType: [''],
            customerDescr: [''],
            customerNbr: ['', [ < any > Validators.required, < any > Validators.maxLength(10), ValidationService.numberValidator]],
            fname: ['', [ < any > Validators.required, < any > Validators.maxLength(50)]],
            lname: ['', [ < any > Validators.required, < any > Validators.maxLength(50)]],
            addresses: this.fb.array([
                this.initAddress(),
            ]),
            phones: this.fb.array([
                this.initPhones(),
            ]),
            review: ['', [ < any > Validators.required, < any > Validators.maxLength(500)]],
            purchase: ['', [ < any > Validators.required, < any > Validators.maxLength(100)]]
        });
        if (contactId) {
            this.showContactInfo(contactId);
        }
    }

    showContactInfo(contactid: any) {
        this.contactService.get(contactid)
            .subscribe((contact: any) => {
                if (contact) {
                    this.contactForm.controls['_id'].setValue(contact._id, { onlySelf: true });
                    this.contactForm.controls['customerType'].setValue(contact.customerType, { onlySelf: true });
                    this.contactForm.controls['customerDescr'].setValue(contact.customerDescr, { onlySelf: true });
                    this.contactForm.controls['customerNbr'].setValue(contact.customerNbr, { onlySelf: true });
                    this.contactForm.controls['fname'].setValue(contact.name.fname, { onlySelf: true });
                    this.contactForm.controls['lname'].setValue(contact.name.lname, { onlySelf: true });
                    this.contactForm.controls['review'].setValue(contact.custStatus.review, { onlySelf: true });
                    this.contactForm.controls['purchase'].setValue(contact.custStatus.purchase, { onlySelf: true });

                    // checking how many address componets presents if not add it
                    const addrectrl = < FormArray > this.contactForm.controls['addresses'];
                    for (var temp = 0; temp < addrectrl.length; ++temp) {
                        this.removeAddress(temp);
                    }
                    for (let i = 0; i < contact.addresses[0].phy.length; i++) {
                        const addctrl = < FormArray > this.contactForm.controls['addresses'];
                        if (contact.addresses[0].phy.length == addctrl.length) {
                            break;
                        }
                        this.addAddress();
                    }
                    const phrectrl = < FormArray > this.contactForm.controls['phones'];
                    for (let removetemp = 0; removetemp < phrectrl.length; removetemp++) {
                        this.removePhoneItem(removetemp);
                    }
                    // checking how many phone componets presents if not add it
                    for (let cntr = 0; cntr < contact.phone.length; cntr++) {
                        const phctrl = < FormArray > this.contactForm.controls['phones'];
                        if (contact.phone.length == phctrl.length) {
                            break;
                        }
                        this.addPhone();
                    }
                    // update address data
                    for (let ctrl = 0; ctrl < contact.addresses[0].phy.length; ctrl++) {
                        const addresscontrol = < FormArray > this.contactForm.controls['addresses'];
                        const eachcontrol = < FormArray > addresscontrol.controls[ctrl];
                        eachcontrol.controls['nbr'].setValue(contact.addresses[0].phy[ctrl].nbr, { onlySelf: true });
                        eachcontrol.controls['city'].setValue(contact.addresses[0].phy[ctrl].city, { onlySelf: true });
                        eachcontrol.controls['street'].setValue(contact.addresses[0].phy[ctrl].street, { onlySelf: true });
                        eachcontrol.controls['state'].setValue(contact.addresses[0].phy[ctrl].state, { onlySelf: true });
                        eachcontrol.controls['zip'].setValue(contact.addresses[0].phy[ctrl].zip, { onlySelf: true });

                    }
                    // update Phone data
                    for (let j = 0; j < contact.phone.length; j++) {
                        const phonecontrol = < FormArray > this.contactForm.controls['phones'];
                        const eachphcontrol = < FormArray > phonecontrol.controls[j];
                        var value = this.formatePhno(contact.phone[j]);
                        eachphcontrol.controls['phone'].setValue(value, { onlySelf: true });
                    }
                }
            });
    };

    save(model: Customer, isValid: boolean) {
        this.submitted = true;
        this.phonesObj = [];
        if (isValid) {
            // change ph Object Structure
            for (let i = 0; i < model.phones.length; ++i) {
                var value = model.phones[i]['phone'].trim().replace(/[()-\s]/g, '');
                this.phonesObj.push(value);
            }
            model.phones = [];
            model.phones = this.phonesObj;

            let self = this;
            this.contactService.save(model)
                .subscribe((data: any) => {
                    console.log(data)
                });
        }
    };
    /* add and remove form components  */
    addAddress() {
        const control = < FormArray > this.contactForm.controls['addresses'];
        control.push(this.initAddress());
    };
    addPhone() {
        const control = < FormArray > this.contactForm.controls['phones'];
        control.push(this.initPhones());
    };
    removeAddress(index: any) {
        const control = < FormArray > this.contactForm.controls['addresses'];
        control.removeAt(index);

    };
    removePhoneItem(index: any) {
        const control = < FormArray > this.contactForm.controls['phones'];
        control.removeAt(index);
    };

    initAddress() {
        return this.fb.group({
            nbr: ['', [ < any > Validators.required, < any > Validators.maxLength(50), ValidationService.numberValidator]],
            street: ['', [ < any > Validators.required, < any > Validators.maxLength(50)]],
            city: ['', [ < any > Validators.required, < any > Validators.maxLength(50)]],
            state: ['', [ < any > Validators.required, < any > Validators.maxLength(50)]],
            zip: ['', [Validators.required, < any > Validators.maxLength(10), ValidationService.zipCodeValidator]]
        });
    };

    initPhones() {
        return this.fb.group({
            phone: ['', [ < any > Validators.required, ValidationService.phoneNumberValidator]]
        });
    };

    formatePhno(value) {
        var country, city, number;
        var value = value.trim().replace(/[()-\s]/g, '');

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
        return number;
    };

}
