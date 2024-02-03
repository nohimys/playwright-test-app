import {Page} from "@playwright/test";

export class NavigationPage {
    private readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    public formLayoutsPage = async () => {
        await this.page.getByText('Forms').click();
        await this.page.getByText('Form Layouts').click();
    }
}