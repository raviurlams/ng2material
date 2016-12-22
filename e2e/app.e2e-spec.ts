import { TrycheckPage } from './app.po';

describe('trycheck App', function() {
  let page: TrycheckPage;

  beforeEach(() => {
    page = new TrycheckPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
