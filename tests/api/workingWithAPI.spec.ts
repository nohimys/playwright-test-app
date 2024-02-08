import {expect, test} from "@playwright/test";
// @ts-ignore
import tags from "./../../test-data/tags.json"

test.beforeEach(async ({page}) => {
    //Intercept Routes from Browser to Server
    await page.route(
        '*/**/api/tags',
        (route, request) => {

            route.fulfill({
                body: JSON.stringify(tags)
            });
        });

    await page.goto('https://conduit.bondaracademy.com');
});

test('title verification', async ({page}) => {
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
});