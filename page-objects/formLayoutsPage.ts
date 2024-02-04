import {Page} from "@playwright/test";

export class FormLayoutsPage {

    constructor(private page: Page) {

    }

    /**
     *  This will submit the form after adding creds
     * @param email User's email used as username
     * @param password Password of the user
     * @param optionText Option that need to be selected from 1,2,3
     */
    public async submitUsingTheGridFormWithCredentialsAndSelectOption(
        email: string,
        password: string,
        optionText: string,
    ){
        const usingTheGrid =
            this.page.locator('nb-card', {hasText: 'Using the Grid'});
        const emailInput =
            usingTheGrid.getByRole('textbox', {name: 'Email'});
        const passwordInput =
            usingTheGrid.getByRole('textbox', {name: 'Password'});
        const radioButton =
            usingTheGrid.getByRole('radio', {name: optionText});

        await emailInput.fill(email);
        await passwordInput.fill(password);
        await radioButton.check({force: true});
        await usingTheGrid.getByRole('button').click();
    }

    /**
     * This method will fill out the inline form of the Form Layout Page
     * @param name First & last name
     * @param email User's email
     * @param rememberMe Whether password need to be remembered
     */
    public async submitInlineFormWithNameEmailAndCheckBox(
        name: string,
        email: string,
        rememberMe:boolean,
    ){
        const inlineForm =
            this.page.locator('nb-card', {hasText: 'Inline form'});
        const nameInput =
            inlineForm.getByRole('textbox', {name: 'Jane Doe'});
        const emailInput =
            inlineForm.getByRole('textbox', {name: 'Email'});
        const checkBox =
            inlineForm.getByRole('checkbox', {name: 'Remember Me'});

        await nameInput.fill(name);
        await emailInput.fill(email);
        if(rememberMe){
            await checkBox.check({force: true});
        }
        await inlineForm.getByRole('button').click();
    }

}