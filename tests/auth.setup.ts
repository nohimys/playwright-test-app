import {test} from '@playwright/test'
import user from './../.auth/user.json'
import fs from 'fs'

const USERNAME = 'pwtest@test.com';
const PASSWORD = 'Welcome1';

const authFile = '.auth/user.json'

test('authetication', async({page, request}) => {
    //Commenting this to get the jwt & save to user.json by calling the API manually
    // await page.goto('https://conduit.bondaracademy.com');
    // await page.locator('app-layout-header a', {hasText: 'Sign in'}).click();
    // await page.getByPlaceholder('Email').fill(USERNAME);
    // await page.getByPlaceholder('Password').fill(PASSWORD);
    // await page.locator('form button', {hasText: 'Sign in'}).click();

    // //It's good to wait for something to identify it's logged in
    // await page.waitForResponse('*/**/api/tags');

    // await page.context().storageState({path: authFile});

    //Get the Auth Token
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            'user': {
                'email': USERNAME,
                'password': PASSWORD
            }
        }
    });
    const responseBody = await response.json();
    const token = responseBody.user.token;

    user.origins[0].localStorage[0].value = token;
    fs.writeFileSync(authFile, JSON.stringify(user));

    process.env['ACCESS_TOKEN'] = token;
});