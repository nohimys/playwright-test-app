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

});