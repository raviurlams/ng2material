/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ContactServiceService } from './contact-service.service';

describe('Service: ContactService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactServiceService]
    });
  });

  it('should ...', inject([ContactServiceService], (service: ContactServiceService) => {
    expect(service).toBeTruthy();
  }));
});
