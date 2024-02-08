import {expect, Page} from "@playwright/test";

export class DatePickerPage {
    constructor(private readonly page: Page) {
    }

    /**
     * This will select a single date from date picker starting from today
     * @param numberOfDayFromToday How many days, from today the selected date has to be
     */
    public async selectCommonDatePickerDateFromToday(numberOfDayFromToday: number){
        const calendarInputField = this.page.getByPlaceholder('Form Picker');
        await calendarInputField.click();

        const selectedDateString = await this.selectDateInTheCalendar(numberOfDayFromToday);

        await expect(calendarInputField).toHaveValue(selectedDateString);
    }

    /**
     * This will select two dates from date picker starting from today & it will
     * represent a range
     * @param startDateFromToday How many dates to start date from today
     * @param endDateFromToday How many dates to end date from today
     */
    public async selectDatepickerWithRangeFromToday(
        startDateFromToday: number,
        endDateFromToday: number
    ) {

        const calendarInputField = this.page.getByPlaceholder('Range Picker');
        await calendarInputField.click();

        const startDateAssertString = await this.selectDateInTheCalendar(startDateFromToday);
        const endDateAssertString = await this.selectDateInTheCalendar(endDateFromToday);

        const assertDate = `${startDateAssertString} - ${endDateAssertString}`;
        await expect(calendarInputField).toHaveValue(assertDate);
    }

    private async selectDateInTheCalendar(numberOfDayFromToday: number){
        //Using class name only to select numbers that are not faded
        const allOfThisMonthDates =
            this.page.locator('[.day-cell.ng-star-inserted]');

        const date = new Date();
        date.setDate(date.getDate() + numberOfDayFromToday);
        const expectedDate = date.getDate().toString();
        const expectedMonthShort =
            date.toLocaleString('En-US', {month: 'short'});
        const expectedMonthLong =
            date.toLocaleString('En-US', {month: 'long'});
        const expectedYear = date.getFullYear();

        //Check whether the correct month is selected
        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent();
        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `

        //Keep clicking Next Month until it matches
        while (!calendarMonthAndYear.includes(expectedMonthAndYear)){
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent();
        }

        await allOfThisMonthDates.getByText(expectedDate, {exact: true}).click();

        return `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;
    }
}