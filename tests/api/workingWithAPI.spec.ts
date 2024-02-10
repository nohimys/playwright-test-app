import { expect, test } from "@playwright/test";
// @ts-ignore
import tags from "./../../test-data/tags.json"

test.beforeEach(async ({ page }) => {
    //Intercept Routes from Browser to Server
    await page.route(
        '*/**/api/tags',
        async (route, request) => {

            await route.fulfill({
                body: JSON.stringify(tags)
            });
        });

    await page.goto('https://conduit.bondaracademy.com');
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