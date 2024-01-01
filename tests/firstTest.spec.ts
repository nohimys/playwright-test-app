import {test} from '@playwright/test'


test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:4200');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
});

test('locator syntax rules', async ({page}) => {
    //Find all exists by Tag Name
    await page.locator('input').first().click();

    //Find by Id
    page.locator('#inputEmail1');

    //Find by Class Value
    page.locator('.shape-rectangle');

    //Find by attribute
    page.locator('[placeholder="Email"]');

    //Find by Entire Class Value
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]');

    //Combine different selector
    //Remember NOT to put spaces between selectors
    page.locator('input.shape-rectangle[placeholder="Email"][type="email"][nbinput]');

    //Find by XPath
    //NOT Recommended
    page.locator('//*[@id="inputEmail1"]');

    //Locate by partial text match
    page.locator(':text("Using")');

    //Locate by exact text match
    page.locator(':text-is("Using the Grid")');

});

test.only('user facing locators', async ({page}) => {

    //It's good to always start with the role
    //It's the usual user thought process
    await page.getByRole('textbox', {name: 'Email'}).first().click();
    await page.getByRole('button', {name: 'Sign In'}).first().click();

    //I think this is referring the HTML for value to do the mapping
    await page.getByLabel('Email').first().click();

    await page.getByPlaceholder('Jane Doe').first().click();

    //We can use any static text we see on Screen here
    await page.getByText('Using the Grid').first().click();

    //Title is also an HTML attribute
    await page.getByTitle('IoT Dashboard').first().click();

    //This id is a PlayWright reserved id defined in the source code itself
    await page.getByTestId('sing-in').first().click();
});