import { Component, OnInit } from '@angular/core';
import { TreeNode, TREE_ACTIONS, KEYS, IActionMapping } from 'angular2-tree-component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { ContactServiceService } from '../contact-service.service';

const actionMapping: IActionMapping = {
    mouse: {
        dblClick: TREE_ACTIONS.TOGGLE_EXPANDED,
        click: (tree, node, $event) => {
            $event.shiftKey ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(tree, node, $event) : TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event)
        }
    },
    keys: {
        [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.name}`)
    }
};
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

    public events: any[] = [];
    public selectedItem: any[] = [];
    public responseData: any = [];
    public treeDatasource: any = [];
    public customersDatasource: any = [];
    public accountsDatasource: any = [];
    public contactDataset: any = [];

    constructor(private contactService: ContactServiceService, private route: ActivatedRoute,
        private router: Router) {

    }

    ngOnInit() {
        this.getList();
        this.getCustomersList();
    }
    getList() {
        let self = this;
        this.contactService.query()
            .subscribe((contacts: any) => {
                self.treeDatasource = self.generateTreeStructure(contacts);
            });
    }

    getCustomersList() {
        let self = this;
        this.contactService.getContacts()
            .subscribe((contactDataset: any) => {
                self.contactDataset = contactDataset;
            });
    }
    generateTreeStructure(data: any) {
        var responseData = [];
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            var preparedObject = {};
            if (obj["custName"]) {
                preparedObject["id"] = obj["_id"];
                preparedObject["name"] = obj["custName"];
            } else {
                preparedObject["id"] = (function() {
                    return '_' + Math.random().toString(36).substr(2, 9);
                })();
                //preparedObject["id"] = null;
                preparedObject["name"] = obj["_id"].toUpperCase();
                preparedObject["children"] = [];
            }
            if (obj["ancestors"] && obj["ancestors"].length > 0) {
                if (obj["parent"]) {
                    this.updateObject(obj["parent"], obj["ancestors"], preparedObject, null, false);
                }
            } else {
                responseData.push(preparedObject);
                this.responseData = responseData;
            }
        }
        return responseData;
    }

    getIndex(value: any) {
        for (var index = 0; index < this.responseData.length; index++) {
            if (this.responseData[index]["name"] === value.toUpperCase()) {
                return index;
            }
        }
        return -1;
    };

    updateObject(parent: any, ancestors: any, preparedObject: any, tempParent: any, isRecursive: any) {
        if (ancestors && ancestors.length > 0) {
            var rootObj, rootIndex;
            if (!isRecursive) {
                rootObj = ancestors.shift();
                rootIndex = this.getIndex(rootObj);
            }
            if (!tempParent) {
                tempParent = this.responseData[rootIndex];
            }
            var currentObj;
            if (ancestors.length == 0) {
                if (rootIndex == -1) {
                    var childIndex = this.getChildIndex(tempParent, rootObj);
                    tempParent = tempParent["children"][childIndex]["children"].push(preparedObject);
                    return tempParent;
                }
                //Adding incase of only 1 parent
                this.responseData[rootIndex]["children"].push(preparedObject);
            }
            while (ancestors && ancestors.length > 0) {
                var currentParent = ancestors.shift();
                if (currentParent != undefined) {
                    var childIndex = this.getChildIndex(tempParent, currentParent);
                    tempParent = tempParent["children"][childIndex];
                    if (ancestors && ancestors.length == 0) {
                        tempParent["children"].push(preparedObject);
                        return tempParent;
                    } else {
                        currentObj = this.updateObject(currentParent, ancestors, preparedObject, tempParent, true);
                    }
                } else {
                    tempParent["children"].push(preparedObject);
                    return tempParent;
                }
            }

        }
    }

    getChildIndex(parent: any, childname: any) {
        for (var index = 0; index < parent["children"].length; index++) {
            if (parent["children"][index]["name"] === childname.toUpperCase()) {
                return index;
            }
        }
        return -1;
    };
    displayAccountDetails(id: any) {
        this.router.navigate(['/ms', id, 1]);
    }
    displayContactDetails(id: any) {
        this.router.navigate(['/ms', id, 0]);
    }
    show(selectedItem: any) {
        this.selectedItem = selectedItem;
        let custmerDS: any = [];
        this.customersDatasource = [];
        this.accountsDatasource = [];
        // USER CLICKS DIRECT CUSTMOR > EX : JHON
        if (parseInt(selectedItem.id)) {
            custmerDS = this.contactDataset.filter((item) => {
                return item.customerNbr == selectedItem.id;
            })[0];

            var obj = {};
            obj['id'] = custmerDS.customerNbr;
            obj['fname'] = custmerDS.name.fname;
            obj['lname'] = custmerDS.name.lname;
            obj['city'] = " - ";
            obj['state'] = " - ";
            obj['country'] = " - ";
            obj['zip'] = " - ";

            for (let ctr = 0; ctr < custmerDS.addresses.length; ctr++) {
                if (custmerDS.addresses[ctr].addressType.toUpperCase() === "DOMICILE" && custmerDS.addresses[ctr].phy.length > 0) {
                    for (let innerctr = 0; innerctr < custmerDS.addresses[ctr].phy.length; innerctr++) {
                        if (custmerDS.addresses[ctr].phy[innerctr].default.toUpperCase() == 'Y') {
                            obj['city'] = custmerDS.addresses[ctr].phy[innerctr].city;
                            obj['state'] = custmerDS.addresses[ctr].phy[innerctr].state;
                            obj['country'] = custmerDS.addresses[ctr].phy[innerctr].country;
                            obj['zip'] = custmerDS.addresses[ctr].phy[innerctr].zip;
                        }
                    }
                }
            }
            this.customersDatasource.push(obj);
            this.accountsDatasource = custmerDS.bank;
        } else {
            custmerDS = this.contactDataset.filter((item) => {
                return (item.path && item.path.indexOf(selectedItem.name) >= 0);
            });
            for (let ctr = 0; ctr < custmerDS.length; ctr++) {
                var custObj = custmerDS[ctr];
                if (custObj.bank) {
                    for (let ctrbank = 0; ctrbank < custObj.bank.length; ctrbank++) {
                        this.accountsDatasource.push(custObj.bank[ctrbank]);
                    }
                }
                var obj = {};
                obj['id'] = custObj.customerNbr;
                obj['fname'] = custObj.name.fname;
                obj['lname'] = custObj.name.lname;
                obj['city'] = " - ";
                obj['state'] = " - ";
                obj['country'] = " - ";
                obj['zip'] = " - ";
                for (let ctr = 0; ctr < custObj.addresses.length; ctr++) {
                    if (custObj.addresses[ctr].addressType.toUpperCase() === "DOMICILE" && custObj.addresses[ctr].phy.length > 0) {
                        for (let innerctr = 0; innerctr < custObj.addresses[ctr].phy.length; innerctr++) {
                            if (custObj.addresses[ctr].phy[innerctr].default.toUpperCase() == 'Y') {
                                obj['city'] = custObj.addresses[ctr].phy[innerctr].city;
                                obj['state'] = custObj.addresses[ctr].phy[innerctr].state;
                                obj['country'] = custObj.addresses[ctr].phy[innerctr].country;
                                obj['zip'] = custObj.addresses[ctr].phy[innerctr].zip;
                            }
                        }
                    }
                }
                this.customersDatasource.push(obj);
            }
        }
        this.contactService.customersDatasource = this.customersDatasource.sort(function(obj1, obj2) {           
            return obj1.id - obj2.id;
        });
        this.contactService.accountsDatasource = this.accountsDatasource;
    }
}
