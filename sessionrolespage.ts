import {Page,Locator,expect} from 'playwright/test';
import path from 'path';

export class SessionRolesPage{
     readonly page: Page;
    // define locators
    readonly sessionRolesScreen:Locator;
    readonly actionsDropdown:Locator;
    readonly addSessionRolesBtn:Locator;
    readonly addSessionRoleScreen:Locator;
    readonly selectRoleDropdown:Locator;
    readonly selectRole:Locator;
    readonly searchEmployeeField:Locator
    readonly addEmployeeBtn:Locator;
    readonly closeBtn:Locator;
    readonly csvUploadBtn:Locator;
    readonly csvUploadScreen:Locator;
    readonly csvAddSessionRoles:Locator;
    readonly setCSVFile:Locator;
    readonly guestActionsBtn:Locator;
    readonly assignGuestBtn:Locator;
    readonly guestCSVUploadBtn:Locator;
    readonly assignLearnerScreen:Locator;
    readonly assigningOrgDropdown:Locator;
    readonly searchAssigningOrg:Locator;
    readonly searchLearnerName:Locator;
    readonly addLearner:Locator;
    readonly guestCSVUploadPopup:Locator;
    readonly assignGuestCSVBtn:Locator;
    readonly closeTabBtn:Locator;
     //intialize locators with locators
    constructor(page: Page){
        this.page=page;
        this.sessionRolesScreen=page.getByRole('heading', { name: /^Session Roles/i });
        this.actionsDropdown=page.locator("button[class='slds-button slds-button_neutral'] lightning-primitive-icon[variant='bare'] svg").last();
        this.addSessionRolesBtn=page.getByText('Add Session Role(s)', { exact: true });
        this.addSessionRoleScreen=page.getByRole('heading', { name: 'Add Session Role' });
        this.selectRoleDropdown=page.getByText('--- Select an option ---', { exact: true });
        this.selectRole=page.getByText('Host', { exact: true }); //make it dynamic
        this.searchEmployeeField=page.getByPlaceholder('Search by employee name...', { exact: true });
        this.addEmployeeBtn=page.getByTitle('Add Guest Role', { exact: true });
        this.closeBtn=page.locator("lightning-icon[class='slds-current-color slds-icon-utility-close slds-icon_container'] lightning-primitive-icon[exportparts='icon'] svg");
        this.csvUploadBtn=page.locator("//lightning-button-menu[@class='slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open']//span[contains(text(),'CSV Upload')]");
        this.csvUploadScreen=page.getByRole('heading', { name: 'Add Session Roles via CSV' });
        this.csvAddSessionRoles=page.getByRole('button', { name: 'Add Session Roles' });
        this.setCSVFile=page.locator('input[part="input"]');
        this.guestActionsBtn=page.locator("div[class='slds-grid slds-grid_vertical-align-end slds-p-horizontal_small slds-m-bottom_small'] div[class='slds-col slds-grow-none slds-col_bump-left'] button[type='button']");
        this.assignGuestBtn=page.locator('span:has-text("Assign Guest")');
        this.guestCSVUploadBtn=page.locator("lightning-menu-item[data-type='upload-csv-modal'] span");
        this.assignLearnerScreen=page.getByRole('heading', { name: 'Assign Learners' })
        this.assigningOrgDropdown=page.locator("c-picklist[class='js-cdo'] span[title='--- Select an option ---']")
        this.searchAssigningOrg=page.locator('input.slds-input.sp-input:visible')
        this.searchLearnerName=page.getByPlaceholder('Search by learner name...')
        this.addLearner=page.getByTitle('Add Guest', { exact: true })
        this.guestCSVUploadPopup=page.getByRole('heading', { name: 'Assign via CSV' });
        this.assignGuestCSVBtn=page.locator("button[title='Assign']");
        this.closeTabBtn=page.getByRole('button', { name: /^Close.*Session$/ }).first();

    }

     async clickSessionRolesActionsBtn(){
        await this.actionsDropdown.isVisible();
        await this.actionsDropdown.evaluate((el: HTMLElement) => {
        el.style.display = 'block';
        el.style.visibility = 'visible';
        el.click();
});
}

    async addSessionRoles(role:string,employeeName:string){
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.sessionRolesScreen).toBeVisible();
        await this.actionsDropdown.isVisible();
        //await this.clickSessionRolesActionsBtn();
        await this.actionsDropdown.scrollIntoViewIfNeeded();
        await this.actionsDropdown.click();
        await this.addSessionRolesBtn.click();
        await expect(this.addSessionRoleScreen).toBeVisible();
        await this.selectRoleDropdown.click();
        await this.page.getByText(role, { exact: true }).click();
        await this.searchEmployeeField.click();
        await this.page.waitForTimeout(3000);
        await this.searchEmployeeField.pressSequentially(employeeName);
        await this.addEmployeeBtn.first().waitFor({ state: 'visible', timeout: 30000 });
        await this.addEmployeeBtn.first().click();
        await this.page.waitForLoadState('domcontentloaded');
        
    }

    async closePopup(popUpLocator:Locator){
        await expect(popUpLocator).toBeVisible();
        await this.closeBtn.click();
        await popUpLocator.waitFor({state: 'detached', timeout: 60000});
        await expect(this.sessionRolesScreen).toBeVisible();
    }

    async csvUpload(csvFilePath:string){
        const filePath = path.resolve(__dirname, './testdata/session_roles.csv');
        await this.sessionRolesScreen.waitFor({state: 'visible', timeout: 90000});
        await this.actionsDropdown.click();
        await this.csvUploadBtn.click();
        await this.csvUploadScreen.waitFor({state:'visible',timeout:60000})
        await this.setCSVFile.setInputFiles(filePath);
        await this.csvAddSessionRoles.click();
        await this.sessionRolesScreen.waitFor({state: 'visible', timeout: 90000});
    }

    async assignGuest(assigningOrd:string,learnerName:string){
        await this.guestActionsBtn.click();
        await this.assignGuestBtn.click()
        await this.assignLearnerScreen.waitFor({state: 'visible', timeout: 90000})
        await this.assigningOrgDropdown.click();
        await this.searchAssigningOrg.pressSequentially(assigningOrd);
        const assigningOrg=this.page.getByText(assigningOrd, { exact: true });
        await assigningOrg.first().waitFor({ state: 'visible', timeout: 30000 });
        await assigningOrg.first().click();
        await this.searchLearnerName.click();
        await this.searchLearnerName.pressSequentially(learnerName);
        await this.addLearner.first().waitFor({ state: 'visible', timeout: 30000 });
        await this.addLearner.first().click();


    }
    async guestCSVUpload(assigningOrd:string,guestCSVFile:string){
        const filePath = path.resolve(__dirname, './testdata/session_roles.csv');
        await this.sessionRolesScreen.waitFor({state: 'visible', timeout: 90000});
        await this.guestActionsBtn.click();
        await this.csvUploadScreen.waitFor({state:'visible',timeout:60000})
        await this.assigningOrgDropdown.click();
        await this.searchAssigningOrg.pressSequentially(assigningOrd);
        const assigningOrg=this.page.getByText(assigningOrd, { exact: true });
        await assigningOrg.first().waitFor({ state: 'visible', timeout: 30000 });
        await assigningOrg.first().click();
        await this.setCSVFile.setInputFiles(guestCSVFile);
        await this.assignGuestCSVBtn.click();
        await this.sessionRolesScreen.waitFor({state: 'visible', timeout: 90000});
    }

    async closeSessionRoleTab(){
        await expect(this.closeTabBtn).toBeVisible();
        await this.closeTabBtn.click();
    }
}     