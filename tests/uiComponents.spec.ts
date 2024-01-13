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

    });

});