import { expect, test } from "@playwright/test";
// @ts-ignore
import tags from "./../../test-data/tags.json"

const USERNAME = 'pwtest@test.com';
const PASSWORD = 'Welcome1';

test.beforeEach(async ({ page }) => {
    //Intercept Routes from Browser to Server
    // await page.route(
    //     '*/**/api/tags',
    //     async (route, request) => {

    //         await route.fulfill({
    //             body: JSON.stringify(tags)
    //         });
    //     });

    await page.goto('https://conduit.bondaracademy.com');

    // await page.locator('app-layout-header a', {hasText: 'Sign in'}).click();
    // await page.getByPlaceholder('Email').fill(USERNAME);
    // await page.getByPlaceholder('Password').fill(PASSWORD);
    // await page.locator('form button', {hasText: 'Sign in'}).click();
});

test('title verification', async ({ page }) => {

    await page.route(
        '*/**/api/articles*',
        async (route, req) => {
            const response = await route.fetch();
            const responseBodyJson = await response.json();
            responseBodyJson.articles[0].title = 'Edited Tittle';
            responseBodyJson.articles[0].description = 'Edited Description';

            await route.fulfill({
                body: JSON.stringify(responseBodyJson)
            });
        });

    await page.getByText('Global Feed').click();

    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
    await expect(page.locator('app-article-list h1').first()).toContainText('Edited Tittle');
    await expect(page.locator('app-article-list p').first()).toContainText('Edited Description');
});

test('delete article', async ({ page, request }) => {
    
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

    const title = "Subterranean";

    //Create Article
    const responseArticle = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
            "article": {
                "title": title,
                "description": "Science",
                "body": "Universe is beautiful"
            }
        },
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json'
        }
    });

    expect(responseArticle.status()).toEqual(201);

    await page.getByText('Global Feed').click();
    await page.getByText(title).click();
    await page.getByRole('button', {name: 'Delete Article'}).first().click();
    await page.getByText('Global Feed').click();

    await expect(page.locator('app-article-list h1').first()).not.toContainText(title);

});

test('create article', async ({page, request}) => {
    const title = 'My Title'

    await page.getByText('New Article').click();
    await page.getByRole('textbox', {name: 'Article Title'}).fill(title);
    await page.getByRole('textbox', {name: "What's this article about?"}).fill('This is about Universe');
    await page.getByRole('textbox', {name: 'Write your article (in markdown)'}).fill('Universe is wonderful.');
    await page.getByRole('button', {name: 'Publish Article'}).click();

    const createResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/');
    const articleslug = (await createResponse.json()).article.slug;

    await expect(page.locator('.article-page h1')).toContainText(title);
    await page.getByText('Home').click();
    await page.getByText('Global Feed').click();
    await expect(page.locator('app-article-list h1').first()).toContainText(title);

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

    //Clean up by API (Delete Article)
    const deleteResponse = await request.delete(
        `https://conduit-api.bondaracademy.com/api/articles/${articleslug}`,{
            headers: {
                Authorization: `Token ${token}`
            }
        });
    expect(deleteResponse.status()).toEqual(204);
    
    await page.getByText('Global Feed').click();
    await expect(page.locator('app-article-list h1').first()).not.toContainText(title);
});