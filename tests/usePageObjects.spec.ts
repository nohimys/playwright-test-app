import {test} from "@playwright/test";
import {NavigationPage} from "../page-objects/navigationPage";
import {FormLayoutsPage} from "../page-objects/formLayoutsPage";
import {DatePickerPage} from "../page-objects/datePickerPage";
import {PageManager} from "../page-objects/pageManager";

test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:4200');
});

test('navigate to pages', async ({page}) => {

    const pageManager = new PageManager(page);

    await pageManager.navigateTo().formLayoutsPage();
    await pageManager.navigateTo().datepickerPage();
    await pageManager.navigateTo().smartTablePage();
    await pageManager.navigateTo().tooltipPage();
    await pageManager.navigateTo().toastrPage();
});

test('parameterised methods', async ({page}) => {
    const pageManager = new PageManager(page);
    const formLayoutsPage = pageManager.onFormLayoutsPage();

    await pageManager.navigateTo().formLayoutsPage();
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

test('datepicker page object', async ({page}) => {
    const datePickerPage = new DatePickerPage(page);
    const navigationPage = new NavigationPage(page);

    await navigationPage.datepickerPage();
    await datePickerPage.selectCommonDatePickerDateFromToday(5);
    await datePickerPage.selectDatepickerWithRangeFromToday(5, 8);
});