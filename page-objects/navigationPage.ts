import {Locator, Page} from "@playwright/test";
import {HelperBase} from "./helperBase";

export class NavigationPage extends HelperBase{

    private readonly formLayoutsMenuItem: Locator;
    private readonly datepickerMenuItem: Locator;
    private readonly smartTableMenuItem: Locator;
    private readonly toastrMenuItem: Locator;
    private readonly tooltipMenuItem: Locator;
    constructor(page: Page) {
        super(page);

        this.formLayoutsMenuItem = this.page.getByText('Form Layouts');
        this.datepickerMenuItem = this.page.getByText('Datepicker');
        this.smartTableMenuItem = this.page.getByText('Smart Table');
        this.toastrMenuItem = this.page.getByText('Toastr');
        this.tooltipMenuItem = this.page.getByText('Tooltip');
    }
    public formLayoutsPage = async () => {
        await this.selectGroupMenuItem('Forms');
        await this.formLayoutsMenuItem.click();
        //Super class method can be accessed
        //await this.waitForNumberOfSeconds(3);
    }

    public datepickerPage = async () => {
        await this.selectGroupMenuItem('Forms');
        await this.datepickerMenuItem.click();
    }
    public smartTablePage = async () => {
        await this.selectGroupMenuItem('Tables & Data');
        await this.smartTableMenuItem.click();
    }
    public toastrPage = async () => {
        await this.selectGroupMenuItem('Modal & Overlays');
        await this.toastrMenuItem.click();
    }
    public tooltipPage = async () => {
        await this.selectGroupMenuItem('Modal & Overlays');
        await this.tooltipMenuItem.click();
    }

    private selectGroupMenuItem = async (groupItemTitle: string) => {
        const groupMenuItem = this.page.getByTitle(groupItemTitle);
        const expandedState =  await groupMenuItem.getAttribute('aria-expanded')
        if(expandedState === 'false'){
            await groupMenuItem.click();
        }
    }
}