import { POLLUTIONPage } from './app.po';

describe('pollution App', () => {
  let page: POLLUTIONPage;

  beforeEach(() => {
    page = new POLLUTIONPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
