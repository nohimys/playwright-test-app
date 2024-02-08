import { Page} from "@playwright/test";
import {NavigationPage} from "./navigationPage";
import {FormLayoutsPage} from "./formLayoutsPage";
import {DatePickerPage} from "./datePickerPage";
export class PageManager {

    private readonly navigationPage: NavigationPage;
    private readonly formLayoutPage: FormLayoutsPage;
    private readonly datePickerPage: DatePickerPage;

    constructor(private readonly page: Page) {
        this.navigationPage = new NavigationPage(this.page);
        this.formLayoutPage = new FormLayoutsPage(this.page);
        this.datePickerPage = new DatePickerPage(this.page);
    }

    public navigateTo(){
        return this.navigationPage;
    }

    public onFormLayoutsPage(){
        return this.formLayoutPage;
    }

    public onDatePickerPage(){
        return this.datePickerPage;
    }
}