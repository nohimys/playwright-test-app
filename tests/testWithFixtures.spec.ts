import { expect } from "@playwright/test";
import { test } from "../test-options";
import { PageManager } from "../page-objects/pageManager";

test('drag & drop with iFrame', async ({ page, globalQaURL }) => {
    
    //This is moved to a Fixture
    // await page.goto(`${globalQaURL}/demo-site/draganddrop/`);

    const frame =
        page.frameLocator('[rel-title="Photo Manager"] iframe');

    const dropZone = frame.locator('#trash');
    await frame.locator('li', { hasText: 'High Tatras 2' }).dragTo(dropZone);

    //Using Mouse
    await frame.locator('li', { hasText: 'High Tatras 4' }).hover();
    await page.mouse.down();
    await dropZone.hover();
    await page.mouse.up();

    await expect(dropZone.locator('li h5')).toHaveText(['High Tatras 2', 'High Tatras 4']);
});

test('Navigate to Form Layout', async ({pageManager}) => {
   
    await pageManager.navigateTo().formLayoutsPage();
});