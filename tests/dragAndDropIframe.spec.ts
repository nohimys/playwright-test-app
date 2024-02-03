import {expect, test} from "@playwright/test";

test('drag & drop with iFrame', async ({page}) => {
    await page.goto('https://www.globalsqa.com/demo-site/draganddrop/');

    const frame =
        page.frameLocator('[rel-title="Photo Manager"] iframe');

    const dropZone = frame.locator('#trash');
    await frame.locator('li', {hasText:'High Tatras 2'}).dragTo(dropZone);

    //Using Mouse
    await frame.locator('li', {hasText:'High Tatras 4'}).hover();
    await page.mouse.down();
    await dropZone.hover();
    await page.mouse.up();

    await expect(dropZone.locator('li h5')).toHaveText(['High Tatras 2', 'High Tatras 4']);
});