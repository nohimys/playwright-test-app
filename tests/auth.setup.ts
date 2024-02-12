import {test} from '@playwright/test'

const USERNAME = 'pwtest@test.com';
const PASSWORD = 'Welcome1';

const authFile = '.auth/user.json'

test('authetication', async({page}) => {
    await page.goto('https://conduit.bondaracademy.com');
    
    await page.locator('app-layout-header a', {hasText: 'Sign in'}).click();
    await page.getByPlaceholder('Email').fill(USERNAME);
    await page.getByPlaceholder('Password').fill(PASSWORD);
    await page.locator('form button', {hasText: 'Sign in'}).click();

    //It's good to wait for something to identify it's logged in
    await page.waitForResponse('*/**/api/tags');

    await page.context().storageState({path: authFile});
});