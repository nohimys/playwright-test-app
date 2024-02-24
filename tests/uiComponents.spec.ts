import { expect, test } from '@playwright/test'

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
});

test.describe.parallel('Form Layout Page', () => {

    test.describe.configure({ retries: 2 });

    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    });

    test('input fields', async ({ page }, testInfo) => {

        if (testInfo.retry) {
            //Execute Clean up work
        }

        const usingTheGridEmailInput =
            page.locator('nb-card', { hasText: 'Using the Grid' })
                .getByRole('textbox', { name: 'Email' });

        const EMAIL = 'test@gmail.com';

        await usingTheGridEmailInput.fill(EMAIL);
        // await usingTheGridEmailInput.clear();
        // await usingTheGridEmailInput.pressSequentially(EMAIL, {delay: 500});

        //Generic Assertions
        // const textContent = await usingTheGridEmailInput.inputValue();
        // expect(textContent).toEqual(EMAIL);

        //Locator Assertions
        //toHaveText won't work for the input field
        await expect(usingTheGridEmailInput).toHaveValue(EMAIL);
    });

    test('radio buttons', async ({ page }) => {
        const usingTheGrid =
            page.locator('nb-card', { hasText: 'Using the Grid' });
        const radioButton1 = usingTheGrid.getByLabel('Option 1');

        //Select Radio Button 1
        await radioButton1.check({ force: true });

        //Select Radio button 2
        await usingTheGrid.getByRole('radio', { name: 'Option 2' }).check({ force: true })

        //Generic Assertion
        const radioStatus =
            await usingTheGrid.getByRole('radio', { name: 'Option 2' }).isChecked()
        expect(radioStatus).toBeTruthy();

        //Locator Assertion
        await expect(radioButton1).toBeChecked({ checked: false });

        //Visual Testing: Take a Screenshot & compare with the following executions
        await expect(usingTheGrid).toHaveScreenshot({ maxDiffPixels: 100 });

    });
});

test.describe('Toastr Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Modal & Overlays').click();
        await page.getByText('Toastr').click();
    });

    test('checkboxes', async ({ page }) => {
        const toasterconfiguration =
            page.locator('nb-card', { hasText: 'Toaster configuration' });

        await toasterconfiguration
            .getByRole('checkbox', { name: 'Hide on click' })
            .uncheck({ force: true });

        await toasterconfiguration
            .getByRole('checkbox', { name: 'Show toast with icon' })
            .uncheck({ force: true });

        //Check or uncheck all checkboxes
        const allCheckBoxes = toasterconfiguration.getByRole('checkbox');
        for (const checkBox of await allCheckBoxes.all()) {
            await checkBox.check({ force: true });
            await expect(checkBox).toBeChecked();
        }
    });
});

test('lists & dropdowns', async ({ page }) => {
    const dropDownMenu = page.locator('ngx-header nb-select');
    await dropDownMenu.click();

    // page.getByRole('list'); //When the list has a UL tag
    // page.getByRole('listitem'); // When the list has a LI tag

    //There are multiple approaches to fetch the list
    // const optionList = page.getByRole('list').locator('nb-option');
    const optionList = page.locator('nb-option-list nb-option');

    await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate']);

    await optionList.filter({ hasText: 'Cosmic' }).click();

    const header = page.locator('nb-layout-header');
    await expect(header).toHaveCSS('background-color', 'rgb(50,50,89)');

    const colors = {
        'Light': 'rgb(255, 255, 255)',
        'Dark': 'rgb(34, 43, 69)',
        'Cosmic': 'rgb(50, 50, 89)',
        'Corporate': 'rgb(50,50,89)'
    }

    for (const colorsKey in colors) {
        await optionList.filter({ hasText: colorsKey }).click();
        await expect(header).toHaveCSS('background-color', colors[colorsKey]);
        if (colorsKey != 'Corporate') {
            await dropDownMenu.click();
        }
    }

});

test.describe('Tooltip Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Modal & Overlays').click();
        await page.getByText('Tooltip').click();
    });

    test('tooltips', async ({ page }) => {
        const toolTipCard = page.locator('nb-card', { hasText: 'Tooltip Placements' });
        await toolTipCard.getByRole('button', { name: 'TOP' }).hover();

        //It will only work if you have a role tooltip created in the web element.
        //But in ours it wasn't there, so we'll have to use a regular locator.
        // page.getByRole('tooltip');

        const toolTipTextContent = await page.locator('nb-tooltip').textContent();
        expect(toolTipTextContent).toEqual('This is a tooltip');

    });
});

test.describe('Table Page', () => {

    test.describe.configure({ mode: 'serial' });

    test.beforeEach(async ({ page }) => {
        await page.getByText('Tables & Data').click();
        await page.getByText('Smart Table').click();
    });

    test('dialog boxes', async ({ page }) => {

        //This is required when dealing with Browser level Dialog Boxes (Not within Web App)
        page.on('dialog', dialog => {
            expect(dialog.message()).toEqual('Are you sure you want to delete?');
            dialog.accept();
        });

        await page
            .getByRole('table')
            .locator('tr', { hasText: 'mdo@gmail.com' })
            .locator('.nb-trash')
            .click()

        const firstRowOfTable = page.locator('table tr').first();

        await expect(firstRowOfTable).not.toHaveText('mdo@gmail.com');
    });

    test('web tables - get the row by any text in the row', async ({ page }) => {
        //Get the row by any text in the row
        const targetRow = page.getByRole('row', { name: 'twitter@outlook.com' });

        //Activate editing
        await targetRow.locator('.nb-edit').click();
        //Write new age
        await page.locator('input-editor').getByPlaceholder('Age').clear();
        await page.locator('input-editor').getByPlaceholder('Age').fill('36');

        //Take Screenshot
        await page.screenshot({path: 'screenshots/age-added.png'});

        //Confirm the row
        await page.locator('.nb-checkmark').click();
    });

    test('web tables - get the row based on a specific value in a column',
        async ({ page }) => {
            //Click on the 2nd page
            await page.locator('.ng2-smart-pagination-nav').getByText('2').click();


            //Get the row based on a specific value in a column
            const targetRowById = page
                .getByRole('row', { name: '11' })
                .filter({ has: page.locator('td').nth(1).getByText('11') });

            //Activate editing
            await targetRowById.locator('.nb-edit').click();

            //Take Screenshot
            targetRowById.screenshot({path: 'screenshots/target-row.png'});
            //Take Screenshot as a bitstream
            //This can be sent to any system you like now.
            const screenshot = targetRowById.screenshot();


            //Write new age
            await page.locator('input-editor').getByPlaceholder('E-mail').clear();
            await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com');
            //Confirm the row
            await page.locator('.nb-checkmark').click();
            //Verify
            await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com');
        });

    test('test filter of the table', async ({ page }) => {
        const agesTestData = [
            { value: '20', isDataFound: true },
            { value: '30', isDataFound: true },
            { value: '40', isDataFound: true },
            { value: '200', isDataFound: false }
        ];

        for (const age of agesTestData) {
            //Type the age in the filter textbox
            await page.locator('input-filter').getByPlaceholder('Age').clear();
            await page.locator('input-filter').getByPlaceholder('Age').fill(age.value);

            //As it takes sometime for the animation.
            page.waitForTimeout(500);

            const ageRows = page.locator('tbody tr');

            for (const row of await ageRows.all()) {
                const cellValue = await row.locator('td').last().textContent()

                if (age.isDataFound) {
                    expect(cellValue).toEqual(age);
                }
                else {
                    expect(await page.getByRole('table').textContent()).toContain('No data found');
                }
            }
        }
    });
});

test.describe('Date Pickers Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click();
        await page.getByText('Datepicker').click();
    });

    test('select date', async ({ page }) => {
        const calendarInputField = page.getByPlaceholder('Form Picker');

        await calendarInputField.click();

        //Using class name only to select numbers that are not faded
        const allOfThisMonthDates =
            page.locator('[class="day-cell ng-star-inserted"]');

        const date = new Date();
        date.setDate(date.getDate() + 400);
        const expectedDate = date.getDate().toString();
        const expectedMonthShort =
            date.toLocaleString('En-US', { month: 'short' });
        const expectedMonthLong =
            date.toLocaleString('En-US', { month: 'long' });
        const expectedYear = date.getFullYear();

        //Check whether the correct month is selected
        let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `

        //Keep clicking Next Month until it matches
        while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
            calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
        }

        await allOfThisMonthDates.getByText(expectedDate, { exact: true }).click();
        await expect(calendarInputField)
            .toHaveValue(`${expectedMonthShort} ${expectedDate}, ${expectedYear}`);
    });
});

test.describe('sliders', () => {
    test('sliders - update by attribute', async ({ page }) => {
        //Approach 1: Update the attribute
        const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle');
        await tempGauge.evaluate(node => {
            node.setAttribute('cx', '232.630');
            node.setAttribute('cy', '232.630');
        });
        //To run the changed event of the element, execute any trigger on tha
        await tempGauge.click();
    });

    test('sliders - update by mouse movement', async ({ page }) => {
        //Approach 1 - Mouse Movement
        const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger');
        //Make sure the circle is visible in the screen.
        await tempBox.scrollIntoViewIfNeeded();

        const boundingBox = await tempBox.boundingBox()
        //find the center as it's easier fot manipulate from there
        const x = boundingBox.x + boundingBox.width / 2;
        const y = boundingBox.y + boundingBox.height / 2;

        //Movement
        await page.mouse.move(x, y);
        await page.mouse.down()
        await page.mouse.move(x + boundingBox.width / 2, y);
        await page.mouse.move(x + boundingBox.width / 2, y + boundingBox.height / 2);
        await page.mouse.up();

        await expect(tempBox).toContainText('30');

    });
});