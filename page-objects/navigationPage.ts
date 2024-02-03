import {Page} from "@playwright/test";

export class NavigationPage {
    private readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    public formLayoutsPage = async () => {
        await this.selectGroupMenuItem('Forms');
        await this.page.getByText('Form Layouts').click();
    }

    public datepickerPage = async () => {
        await this.selectGroupMenuItem('Forms');
        await this.page.getByText('Datepicker').click();
    }
    public smartTablePage = async () => {
        await this.selectGroupMenuItem('Tables & Data');
        await this.page.getByText('Smart Table').click();
    }
    public toastrPage = async () => {
        await this.selectGroupMenuItem('Modal & Overlays');
        await this.page.getByText('Toastr').click();
    }
    public tooltipPage = async () => {
        await this.selectGroupMenuItem('Modal & Overlays');
        await this.page.getByText('Tooltip').click();
    }

    private selectGroupMenuItem = async (groupItemTitle: string) => {
        const groupMenuItem = this.page.getByTitle(groupItemTitle);
        const expandedState =  await groupMenuItem.getAttribute('aria-expanded')
        if(expandedState === 'false'){
            await groupMenuItem.click();
        }
    }
}