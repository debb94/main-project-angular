import { TestBed } from '@angular/core/testing';

import { HandlerAppService } from './handler-app.service';

describe('HandlerAppService', () => {
  let service: HandlerAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandlerAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
