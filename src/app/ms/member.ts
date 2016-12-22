export interface Member {
    id: string;
    fname ? : string;
    lname ? : string;
    billingaddresses: Address[];
    mailingaddresses: Address[];
    domicileaddresses: Address[];
    testaddresses: childaddresses[];

}

export interface Address {
    nbr ? : string;
    street ? : string;
    city ? : string;
    state ? : string;
    country ? : string;
    zip ? : string;
}


export interface childaddresses {
    addressType ? : string;
    contacts ? : contact[];
}
export interface contact {
    name ? : string;
    phone ? : string;
}
