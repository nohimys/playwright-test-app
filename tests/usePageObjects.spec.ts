import {test} from "@playwright/test";
import {NavigationPage} from "../page-objects/navigationPage";
import {FormLayoutsPage} from "../page-objects/formLayoutsPage";

test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:4200');
});

test('navigate to pages', async ({page}) => {
    const navigationPage = new NavigationPage(page);
    await navigationPage.formLayoutsPage();
    await navigationPage.datepickerPage();
    await navigationPage.smartTablePage();
    await navigationPage.tooltipPage();
    await navigationPage.toastrPage();
});

test('parameterised methods', async ({page}) => {
    const formLayoutsPage = new FormLayoutsPage(page);
    const navigationPage = new NavigationPage(page);

    await navigationPage.formLayoutsPage();
    await formLayoutsPage.submitUsingTheGridFormWithCredentialsAndSelectOption(
        'test@test.com',
        '123',
        'Option 1'
    );
    await formLayoutsPage.submitInlineFormWithNameEmailAndCheckBox(
        'Test Name',
        'test@test.com',
        true
    );
});