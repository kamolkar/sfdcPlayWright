import {Page,Locator, expect} from 'playwright/test';

export class SessionPage{
     readonly page: Page;

    //Define Locators
     readonly addSessionBtn: Locator;
     readonly addSessionScreen: Locator;
     readonly sessionTypeDropdown: Locator;
     readonly searchBtn: Locator;
     readonly selectSessionType : Locator;
     readonly statusTypeDropdown: Locator;
     readonly selectStatusType: Locator;
     readonly sessionNameInput: Locator;
     readonly descriptionInput: Locator;
     readonly dateInput : Locator;
     readonly startTimeInput : Locator;
     readonly endTimeInput : Locator;
     readonly timeZoneDropdown : Locator;
     //readonly searchOption:Locator;
     readonly regionDropdown : Locator;
     readonly selectRegion : Locator;
     readonly Savebtn: Locator;
     readonly buildTab: Locator;
     readonly sessionActionsBtn: Locator;
     readonly addSessionBtnActions: Locator;
     readonly sessionRowLinks:Locator;
     readonly eventDetailsScreen:Locator;
     readonly zoomOption:Locator;
     readonly physicalCapacity:Locator;
     readonly addLaterOption:Locator;
     
    

    //intialize locators with locators
    constructor(page: Page){
        this.page=page;
        this.eventDetailsScreen=page.getByRole('button', { name: 'Event Details' });
        this.addSessionBtn=page.getByRole('button', { name: 'Add Session' });
        this.addSessionScreen=page.getByRole('heading', { name: 'Session Details' });
        this.sessionTypeDropdown=page.locator("c-picklist[data-field='Session_Type__c'] span[title='--- Select an option ---']");
        this.searchBtn=page.locator('input.slds-input.sp-input:visible');
        this.selectSessionType=page.getByTitle('Physical', { exact: true });
        this.statusTypeDropdown=page.locator("c-picklist[data-field='Status__c'] span[title='--- Select an option ---']")
        this.selectStatusType=page.locator("span[class='slds-media__body'] span[title='Active']")
        //this.sessionNameInput=page.getByRole('textbox', { name: '*Name' })
        this.sessionNameInput=page.getByLabel('*Name', { exact: true })
        //this.descriptionInput=page.getByRole('textbox', { name: '*Description' })
        this.descriptionInput=page.getByLabel('*Description', { exact: true })
        //this.dateInput=page.getByRole('textbox', { name: '*Date' })
        this.dateInput=page.getByLabel('*Date', { exact: true })
        //this.startTimeInput=page.getByRole('combobox', { name: '*Start Time' })// enter value and press tab
        this.startTimeInput=page.getByLabel('*Start Time', { exact: true })
        //this.endTimeInput=page.getByRole('combobox', { name: '*End Time' })
        this.endTimeInput=page.getByLabel('*End Time', { exact: true })
        this.timeZoneDropdown=page.locator("c-picklist[data-field='Time_Zone__c'] span[title='--- Select an option ---']")
        //this.searchOption=page.locator('input.slds-input.sp-input:visible')
        this.regionDropdown=page.locator("c-picklist[data-field='Region__c'] span[title='--- Select an option ---']")
        this.selectRegion=page.getByText('APAC', { exact: true })
        this.Savebtn=page.getByText('Save', { exact: true }) 
        this.buildTab=page.locator('#flexipage_tab__item:visible'); 
        this.sessionActionsBtn=page.locator("button[class='slds-button slds-button_neutral'] lightning-primitive-icon[variant='bare'] svg");
        this.addSessionBtnActions=page.getByText('Add Session', { exact: true });
        this.sessionRowLinks = page.locator("th[data-label='Name'] div.slds-truncate a");
        this.zoomOption=page.getByText('Zoom', { exact: true });
        this.physicalCapacity=page.getByRole('spinbutton', { name: 'Physical Capacity' });
        this.addLaterOption=page.getByText('Add Later', { exact: true });
        
            
       
    }
    // select session type from dropdown
     private async selectFromSessionDropdown(sessionType: string) {
        console.log(`Session Type: ${sessionType}`)
        await this.page.waitForTimeout(3000);
        await this.sessionTypeDropdown.waitFor({ state: 'attached', timeout: 50000 });
        await this.sessionTypeDropdown.click();
        await this.searchBtn.waitFor({ state: 'visible', timeout: 80000 })
        await this.searchBtn.pressSequentially(sessionType);
        const sessionTypeSelect=this.page.getByTitle(sessionType, { exact: true });
        await sessionTypeSelect.waitFor({ state: 'attached', timeout: 50000 });
        await sessionTypeSelect.scrollIntoViewIfNeeded();
        await sessionTypeSelect.click();
    }

     // select status from dropdown
     private async selectFromStatusDropdown(statusName: string) {
        await this.statusTypeDropdown.click();
        await this.searchBtn.waitFor({ state: 'visible', timeout: 80000 })
        await this.searchBtn.pressSequentially(statusName);
        const statusSelect=this.page.locator(`span[class='slds-media__body'] span[title='${statusName}']`);
        await statusSelect.waitFor({ state: 'attached', timeout: 20000 });
        await statusSelect.scrollIntoViewIfNeeded();
        await statusSelect.click();
    }
    // select from TimeZone Drop down
     private async searchAndSelectTimeZone(cityName: string) {
        await this.timeZoneDropdown.click();
        await this.searchBtn.waitFor({ state: 'visible', timeout: 60000 })
        await this.searchBtn.pressSequentially(cityName);
        await this.page.waitForTimeout(5000);
        await this.page.waitForLoadState('domcontentloaded');
        // const timeZoneResult= this.page.getByTitle(new RegExp(cityName, 'i'));
        // //await timeZoneResult.first().waitFor({ state: 'visible', timeout: 10000 });
        // //await timeZoneResult.first().click();
        // await timeZoneResult.first().waitFor({ state: 'attached', timeout: 50000 });
        // await timeZoneResult.first().click();
        const timeZoneOption = this.page
        .locator('c-picklistoption_picklistoption, .slds-listbox__option')
        .getByText(new RegExp(cityName, 'i'))
        .first();
        await timeZoneOption.scrollIntoViewIfNeeded();
        await timeZoneOption.waitFor({ state: 'attached', timeout: 20000 });
        //await timeZoneOption.click({ force: true })
        await timeZoneOption.dispatchEvent('click');
     
    // select from Region dropdown    
    }
     private async searchAndSelectRegion(region: string) {
        await this.regionDropdown.click();
        await this.searchBtn.waitFor({ state: 'visible', timeout: 60000 })
        await this.searchBtn.pressSequentially(region);
        await this.page.waitForTimeout(5000);
        const regionResult=this.page.getByText(region, { exact: true });
        await regionResult.first().waitFor({ state: 'visible', timeout: 10000 });
        await regionResult.first().click();
    }

    get addSessionScreenLocator(){
        return this.addSessionScreen;
    }

    async clickAddSession(){
        await expect(this.eventDetailsScreen).toBeVisible();
        await this.addSessionBtn.click();
    }

    async clickActionsAndAddSession(){
        await expect(this.sessionActionsBtn).toBeVisible();
        await this.sessionActionsBtn.click();
        await this.addSessionBtnActions.click();
    }

    /**
     * Fills out the entire Asset creation form
     * @param details Object containing all field data
     */
    async createSession(details: any) {
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.addSessionScreen).toBeVisible();
        
        // Handle Dropdowns
        await this.selectFromSessionDropdown(details.SessionType);
        //await this.sessionTypeDropdown.press("Tab");
        await this.selectFromStatusDropdown(details.Status);
        //await this.statusTypeDropdown.press("Tab");

        // fill text fields
        const sessionName:string=details.Name;
        console.log(`Session Name: ${details.Name}`);
        //await this.sessionNameInput.click();
        //await this.sessionNameInput.waitFor({ state: 'visible', timeout: 60000 })
        await this.sessionNameInput.click()
        await this.sessionNameInput.fill(details.Name);
        //await this.descriptionInput.click()
        await this.descriptionInput.fill(details.Description);
        await this.descriptionInput.press("Tab");
        await this.dateInput.fill(details.Date);
         await this.dateInput.press("Tab");
        await this.startTimeInput.fill(details.StartTime);
        await this.startTimeInput.press("Tab");
        await this.endTimeInput.fill(details.EndTime);
        await this.endTimeInput.press("Tab");
        //handle searchable dropdowns
        await this.searchAndSelectTimeZone(details.TimeZoneCity);
        await this.searchAndSelectRegion(details.Region);
        // add virtual and hybrid session steps
        switch(details.SessionType){
            case 'Physical':
                console.log("Save the record");
                break;
            case 'Virtual':
                await this.virtualSessionSteps();   
                break;
            case 'Hybrid':
                await this.hybridSessionSteps() ;
               break;
            default:
                throw new Error('Unhandled session type',details.SessionType)
        }

        // Click on Save button
        await this.Savebtn.scrollIntoViewIfNeeded();
        await this.Savebtn.waitFor({ state: 'visible', timeout: 90000})
        await this.Savebtn.click();
        await this.addSessionBtn.waitFor({ state: 'detached', timeout: 200000 });
        await this.page.waitForLoadState('domcontentloaded', { timeout: 200000 });
        await this.page.waitForTimeout(8000);
        await this.validateSessionCreation(sessionName);
        /*
        await this.addSessionBtn.waitFor({ state: 'detached', timeout: 120000 });
        await this.page.waitForLoadState('domcontentloaded', { timeout: 200000 });
        await this.page.waitForTimeout(13000);
        this.page.getByRole('link', { name: sessionName }).waitFor({ state: 'visible', timeout: 200000})
        */
       
        //await this.buildTab.waitFor({ state: 'visible', timeout: 90000})
    }

    async virtualSessionSteps(){
        await this.zoomOption.scrollIntoViewIfNeeded();
        await expect(this.zoomOption).toBeVisible();
        await this.zoomOption.click();
    } 

    async hybridSessionSteps(){
        await this.addLaterOption.scrollIntoViewIfNeeded();
        await expect(this.addLaterOption).toBeVisible();
        await this.addLaterOption.click();
    }

    async validateSessionCreation(sessionName:string){
        try{
            console.log(`Created Session Name :${sessionName}`)
            await this.page.waitForLoadState('domcontentloaded', { timeout: 200000 });
            const sessionLocator=this.page.getByRole('link', { name: sessionName })
            await sessionLocator.waitFor({ state: 'visible', timeout: 200000})
            await expect(sessionLocator).toBeVisible()
        }catch(error){
            console.log(`Error while checking the created session: ${error}`);
        }
    }

    async getSessionCount(): Promise<number> {
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.sessionRowLinks.first()).toBeVisible();
        await this.page.waitForLoadState('domcontentloaded');
        return await this.sessionRowLinks.count();
    }

    async clickSessionRow(index: number): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        const targetingLink = this.sessionRowLinks.nth(index);
        await targetingLink.scrollIntoViewIfNeeded();
        targetingLink.click()
        await this.page.waitForLoadState('domcontentloaded');
    }
}