import {Page,expect,Locator} from 'playwright/test';
import { ACTUtils } from '../../utils/actUtils';

export class CourseEventPage{
     readonly page: Page;
     readonly actUtils:ACTUtils;

    //Define Locators
     readonly newAssetEventScreen: Locator;
     readonly eventTypeDropdown: Locator;
     readonly reqSessionsInput: Locator;
     readonly assetNameInput : Locator;
     readonly descriptionInput: Locator;
     readonly timeEstimateInput: Locator;
     readonly contentOwnerDropdown: Locator;
     readonly contentPOCDropdown: Locator;
     readonly selectEventTypeValue : Locator;
     readonly selectContentOwnerValue : Locator;
     readonly selectContentPOCValue : Locator;
     readonly btnSave : Locator;
     readonly eventDetailsScreen:Locator;
     readonly editCourseStatus : Locator;
     readonly statusDropdown : Locator;
     readonly selectActiveStatus : Locator;
     readonly checkActiveStatus: Locator;
     readonly createdRecordHeading: Locator;
     
    

    //intialize locators with CSS selectors
    constructor(page: Page){
        this.page=page;
        this.actUtils= new ACTUtils(page);
        this.newAssetEventScreen=page.getByRole('heading', { name: 'New Asset: Event' });
        this.eventTypeDropdown=page.getByRole('combobox', { name: 'Event Type' });
        this.reqSessionsInput=page.locator('input[name="Mandatory_Session_Count__c"]');
        //this.assetNameInput=page.getByRole('textbox', { name: '*Asset Name' });
        this.assetNameInput=page.locator('input[name="Name"]');
        this.descriptionInput=page.locator('input[name="Description__c"]');
        this.timeEstimateInput=page.locator('[name="Time_Estimate_Minutes__c"]');
        this.contentOwnerDropdown=page.getByRole('combobox', { name: 'Content Owner Organization' });
        this.contentPOCDropdown=page.getByRole('combobox', { name: 'Content POC' });
        this.selectEventTypeValue=page.locator('lightning-base-combobox-item:has-text("Course")');
        this.selectContentOwnerValue=page.locator("//span[@title='Employee Success']");
        this.selectContentPOCValue=page.getByText('Sudha S Designer', { exact: true });
        //this.btnSave=page.locator('button[name="SaveEdit"]');
        this.btnSave=page.getByText('Save', { exact: true });
        this.eventDetailsScreen=page.getByRole('button', { name: 'Event Details' });
        //this.editCourseStatus=page.locator("button[title='Edit Status'] span[class='inline-edit-trigger-icon slds-button__icon slds-button__icon_hint']");
        this.editCourseStatus=page.getByRole('button', { name: 'Edit Status' })
        this.statusDropdown=page.getByRole('combobox', { name: 'Status' });
        this.selectActiveStatus=page.locator("span[class='slds-media__body'] span[title='Active']");
        //this.checkActiveStatus=page.locator('lightning-formatted-text:has-text("Active")');
        this.checkActiveStatus=page.locator('lightning-formatted-text').filter({ hasText: 'Active' }).filter({ has: page.locator("div[data-target-selection-name='sfdc:RecordField.Asset__c.Status__c'] span[class='test-id__field-label']")});
        this.createdRecordHeading=page.locator(`//lightning-formatted-text[@slot='primaryField']`);
        
       
    }


    /**
     * Fills out the entire Asset creation form
     * @param details Object containing all field data
     */
    async fillAssetDetails(details: any) {
        const eventType:string=details.EventType;
        const ContentOwnerOrg:string=details.ContentOwnerOrganization;
        const contentPOC:string=details.ContentPOC;
        // Handle Dropdowns
        //await this.selectEventTypeDropdown(this.eventTypeDropdown, eventType);
        await this.actUtils.selectFromDropdown(this.eventTypeDropdown,details.EventType);
        
        // Fill Text Fields
        await this.reqSessionsInput.fill(details.RequiredSessions);
        await this.reqSessionsInput.press("Tab");
        await this.assetNameInput.fill(details.AssetName);
        await this.descriptionInput.fill(details.Description);
        await this.timeEstimateInput.fill(details.TimeEstimateInMinutes);
        await this.timeEstimateInput.press("Tab");
        // Handle Content Owner Dropdown
        await this.actUtils.selectFromDropdown(this.contentOwnerDropdown,details.ContentOwnerOrganization);
        await this.actUtils.selectContentPOCDropdown(this.contentPOCDropdown,details.ContentPOC);

        // Click on Save button
        await this.btnSave.press("Tab");
        await this.btnSave.click();
        await expect(this.eventDetailsScreen).toBeVisible();
        await expect(this.createdRecordHeading.first()).toHaveText(details.AssetName);
    }

  

    async isEventDetailsExists(){
        try{
           await expect(this.eventDetailsScreen).toBeVisible(); 
        } catch(error){
            console.log(`Error checking the Event Details screen after click on Save: ${error}`);
            return false;
        }

    }

    async changeEventStatus(){
        await this.page.waitForLoadState('domcontentloaded')
        await expect(this.editCourseStatus).toBeVisible();
        await this.editCourseStatus.click();
        await this.statusDropdown.click();
        await this.selectActiveStatus.click();
        await this.btnSave.click();
        await this.page.waitForLoadState('domcontentloaded')
        await expect(this.eventDetailsScreen).toBeVisible();
    }
 
    


}