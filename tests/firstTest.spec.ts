import {expect, test} from '@playwright/test'


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

test('user facing locators', async ({page}) => {

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
    await page.getByTestId('sign-in').first().click();
});

test('locating child elements', async ({page}) => {
    //You can keep spaces for going into each child
    await page.locator('nb-card nb-radio :text-is("Option 1")').click();
    //You can use chaining also for going into each child
    await page
        .locator('nb-card')
        .locator('nb-radio')
        .locator(':text-is("Option 2")').click();

    await page
        .locator('nb-card')
        .getByRole('button', {name: 'Sign In'})
        .first().click();

    //Least preferable - nth function (Here index always starts with zero)
    await page
        .locator('nb-card')
        .nth(3)
        .getByRole('button')
        .click();
});

test('locating parent elements', async ({page}) => {
    //This will provide the element having text somewhere in the DOM within the mentioned selector
    await page
        .locator('nb-card',{hasText: 'Using the grid'})
        .getByRole('textbox', {name: 'Email'}).first().click();

    //As the 2nd parameter we can add an another locator using 'has' as well
    await page
        .locator('nb-card', {has: page.locator('#inputEmail1')})
        .getByRole('textbox', {name: 'Email'}).first().click();

    //Filter method also can be used for similar capabilities as the 2nd argument of the locator method
    await page
        .locator('nb-card').filter({hasText: 'Basic Form'})
        .getByRole('textbox', {name: 'Email'}).first().click();
    await page
        .locator('nb-card').filter({has: page.locator('.status-danger')})
        .getByRole('textbox', {name: 'Password'}).first().click();

    //Using multiple filters to track down an element
    await page
        .locator('nb-card')
        .filter({has: page.locator('nb-checkbox')})
        .filter({hasText: 'Sign in'})
        .getByRole('textbox', {name: 'Email'}).first().click();

    //Going one level up to the parent
    await page
        .locator(':text-is("Using the Grid")').locator('..')
        .getByRole('textbox', {name: 'Email'}).first().click();
});

test('reusing locators', async ({page}) => {

    const basicForm =
        page.locator('nb-card').filter({hasText: 'Basic Form'});
    const textBox = (name) => {
        return basicForm.getByRole('textbox', {name: name})
    }

    await textBox('Email').fill('test@test.com');
    await textBox('Password').fill('test1');
    await basicForm.locator('nb-checkbox').click();
    await basicForm.getByRole('button').click();

    await expect(textBox('Email')).toHaveValue('test@test.com');
    await expect(textBox('Password')).toHaveValue('test1');
});

test('extract values', async ({page}) => {
    const basicForm =
        page.locator('nb-card').filter({hasText: 'Basic Form'});

    //Single Text extraction
    const buttonText =
        await basicForm.locator('button').textContent();
    expect(buttonText).toEqual('Submit');

    //Get a set of Text Values
    const allRadioButtonTextContent =
        await basicForm.locator('nb-radio').allTextContents();
    expect(allRadioButtonTextContent).toContain('Option 1');

    //Extract input tag values
    const emailField= basicForm.getByRole('textbox', {name: 'Email'});
    await emailField.fill('test@test.com');
    const inputValue = await emailField.inputValue();
    expect(inputValue).toEqual('test@test.com');

    //Get the value on a particular attribute
    const placeHolderValue = await emailField.getAttribute('placeholder');
    expect(placeHolderValue).toEqual('Email');

});

test('assertions', async ({page}) => {

    const basicForm =
        page.locator('nb-card').filter({hasText: 'Basic Form'});
    const basicFormButton = basicForm.locator('button');

    //General Assertions
    const value = 5;
    expect(value).toEqual(5);

    //General Assertions
    const text = await basicFormButton.textContent();
    expect(text).toEqual('Submit');

    //Locator Assertions
    await expect(basicFormButton).toHaveText('Submit');

    //Soft Assertions
    await expect.soft(basicFormButton).toHaveText('Submit2');
    await basicFormButton.click();
});