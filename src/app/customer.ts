export interface Customer {
    _id: string;
    customerType: string;
    customerDescr: string;
    customerNbr?: string;
    fname?: string;
    lname?: string;
    addresses: Address[];
    phones: Phones[];
    review?: string;
    purchase?: string;
}

export interface Address {
    nbr?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
}
export interface Phones {
    phone?: string
}
