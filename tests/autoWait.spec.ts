import {expect, test} from '@playwright/test'

test.beforeEach(async ({page}) => {
    await page.goto('http://uitestingplayground.com/ajax');
    await page.getByText('Button Triggering AJAX Request').click();
});

test('auto waiting', async ({page}) => {
    const successParagraph = page.locator('.bg-success');

    //This will auto-wait
    const textContent = await successParagraph.textContent();
    expect(textContent).toEqual('Data loaded with AJAX get request.');

    //We can have an outer logic for waiting
    await successParagraph.waitFor({state: 'attached'});

    //The default timout for Locator Assertions is 5 seconds
    //It can be overridden
    await expect(successParagraph)
        .toHaveText('Data loaded with AJAX get request.', {timeout: 20000});
});

test('alternative waits', async ({page}) => {
    const successParagraph = page.locator('.bg-success');

    //___ Wait for element
    // await page.waitForSelector('.bg-success');

    //___ Wait for the response
    // await page.waitForResponse('http://uitestingplayground.com/ajaxdata');

    //___ Wait for all the network API calls to be completed - NOT RECOMMENDED
    await page.waitForLoadState('networkidle');

    const allTextContents = await successParagraph.allTextContents();
    expect(allTextContents).toContain('Data loaded with AJAX get request.');
});