export class ValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue ? : any) {
        let config = {
            'required': 'Required',
            'invalidphnumber': 'Enter valid Ph number',
            'invalidNumber': 'Enter valid number',
            'invalidZipcode': 'Invalid Zip code',
            'minlength': `Minimum length ${validatorValue.requiredLength}`,
            'maxlength': `Maximum length ${validatorValue.requiredLength}`
        };

        return config[validatorName];
    }

    static phoneNumberValidator(control) {
        let tel = control.value;
        let regx = /[^0-9]/
        if (!tel) {
            return '';
        }
        var value = tel.trim().replace(/[()-\s]/g , '');  

        if (value.match(regx)) {
            return { 'invalidphnumber': true };
        }
        
        if (value.length < 10 || 10 < value.length) {
            return { 'invalidphnumber': true };
        }
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
                return tel;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 3) + '-' + number.slice(3);
        number = (country + " (" + city + ") " + number).trim();
        return null;
    }

    static zipCodeValidator(control) {        
        var zipPattern = /^\d{5}(?:[-\s]\d{4})?$/;
        if (zipPattern.test(control.value)) {
            return null;
        } else {
            return { 'invalidZipcode': true };

        }
    }

    static numberValidator(control) {
        //let value = control.value.trim().replace(/[-\s]/g , ''); 
        var numPattern = /^[0-9\s]*$/;
        if (numPattern.test(control.value)) {
            return null;
        } else {
            return { 'invalidNumber': true };
        }
    }
}
