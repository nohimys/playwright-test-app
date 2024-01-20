import {expect, test} from '@playwright/test'

test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:4200');
});

test.describe('Form Layout Page', () => {
    test.beforeEach(async ({page}) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    });

    test('input fields', async ({page}) => {
        const usingTheGridEmailInput =
            page.locator('nb-card', {hasText: 'Using the Grid'})
                .getByRole('textbox', {name: 'Email'});

        const EMAIL = 'test@gmail.com';

        await usingTheGridEmailInput.fill(EMAIL);
        // await usingTheGridEmailInput.clear();
        // await usingTheGridEmailInput.pressSequentially(EMAIL, {delay: 500});

        //Generic Assertions
        // const textContent = await usingTheGridEmailInput.inputValue();
        // expect(textContent).toEqual(EMAIL);

        //Locator Assertions
        //toHaveText won't work for the input field
        await expect(usingTheGridEmailInput).toHaveValue(EMAIL);
    });

    test('radio buttons', async ({page}) => {
        const usingTheGrid =
            page.locator('nb-card', {hasText: 'Using the Grid'});
        const radioButton1 = usingTheGrid.getByLabel('Option 1');

        //Select Radio Button 1
        await radioButton1.check({force: true});

        //Select Radio button 2
        await usingTheGrid.getByRole('radio', {name: 'Option 2'}).check({force: true})

        //Generic Assertion
        const radioStatus =
            await usingTheGrid.getByRole('radio', {name: 'Option 2'}).isChecked()
        expect(radioStatus).toBeTruthy();

        //Locator Assertion
        await expect(radioButton1).toBeChecked({checked: false});

    });
});

test.describe('Toastr Page', () => {
    test.beforeEach(async ({page}) => {
        await page.getByText('Modal & Overlays').click();
        await page.getByText('Toastr').click();
    });

    test('checkboxes', async ({page}) => {
        const toasterconfiguration =
            page.locator('nb-card', {hasText: 'Toaster configuration'});

        await toasterconfiguration
            .getByRole('checkbox', {name: 'Hide on click'})
            .uncheck({force: true});

        await toasterconfiguration
            .getByRole('checkbox', {name: 'Show toast with icon'})
            .uncheck({force: true});

        //Check or uncheck all checkboxes
        const allCheckBoxes = toasterconfiguration.getByRole('checkbox');
        for (const checkBox of await allCheckBoxes.all()) {
            await checkBox.check({force: true});
            await expect(checkBox).toBeChecked();
        }
    });
});

test('lists & dropdowns', async ({page}) => {
    const dropDownMenu = page.locator('ngx-header nb-select');
    await dropDownMenu.click();

    // page.getByRole('list'); //When the list has a UL tag
    // page.getByRole('listitem'); // When the list has a LI tag

    //There are multiple approaches to fetch the list
    // const optionList = page.getByRole('list').locator('nb-option');
    const optionList = page.locator('nb-option-list nb-option');

    await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate']);

    await optionList.filter({hasText: 'Cosmic'}).click();

    const header = page.locator('nb-layout-header');
    await expect(header).toHaveCSS('background-color','rgb(50,50,89)');

    const colors = {
        'Light': 'rgb(255, 255, 255)',
        'Dark': 'rgb(34, 43, 69)',
        'Cosmic': 'rgb(50, 50, 89)',
        'Corporate': 'rgb(50,50,89)'
    }

    for (const colorsKey in colors) {
        await optionList.filter({hasText: colorsKey}).click();
        await expect(header).toHaveCSS('background-color',colors[colorsKey]);
        if(colorsKey != 'Corporate'){
            await dropDownMenu.click();
        }
    }

});