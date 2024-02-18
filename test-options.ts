import { test as base } from '@playwright/test';
import { PageManager } from './page-objects/pageManager';

export type TestOptions = {
    globalQaURL: string,
    qaWebsitePage: string,
    pageManager: PageManager
}

export const test = base.extend<TestOptions>({
    globalQaURL: ['', {option: true}],
    qaWebsitePage: [async ({page, globalQaURL}, use) => {
        await page.goto(`${globalQaURL}/demo-site/draganddrop/`);
        //To use this as a fixture
        await use('');
    },{auto: true}],
    pageManager: async ({page}, use) => {
        const pageManager = new PageManager(page);
        const formLayoutsPage = pageManager.onFormLayoutsPage();
        use(pageManager);
    }
});