import { Page, Locator, expect } from '@playwright/test';
import { ACTUtils } from '../../utils/actUtils';


export class ContentBlockPage {
  readonly page: Page;
  readonly actUtils:ACTUtils;
  readonly contentDetailsScreen:Locator;
  readonly createdRecordHeading:Locator;

  
  // Grouping locators 
 private readonly locators = {
    assetNameInput: () => this.page.getByLabel('*Asset Name'),
    descriptionInput: () => this.page.getByLabel('*Description'),
    timeEstimateInput: () => this.page.getByLabel('*Time Estimate (Minutes)'),
    //contentPocInput: () => this. page.getByPlaceholder('Search Learner Profiles...'),
    saveButton: () => this.page.getByText('Save', { exact: true }),
    //statusDropdown: () => this. page.getByRole('combobox', { name: 'Status' }),
    //contentEditor: () => this. page.locator('div[aria-label="Content"]'),
    contentOwnerDropdown: () => this.page.getByRole('combobox', { name: 'Content Owner Organization' }),
    contentPOCDropdown: () => this.page.getByRole('combobox', { name: 'Content POC' })
   }


  constructor(page: Page) {
    this.page = page;
    this.actUtils= new ACTUtils(page);
    this.contentDetailsScreen=page.getByRole('button', { name: 'Content Details' })
    this.createdRecordHeading=page.locator(`//lightning-formatted-text[@slot='primaryField']`);
  }

async createContentBlock(details: any) {
    await this.locators.assetNameInput().fill(details.AssetName);
    //await this.locators.assetNameInput().press("Tab")
    console.log("description :",details.Description)
    await this.locators.descriptionInput().fill(details.Description);
    await this.locators.timeEstimateInput().fill(details.TimeEstimateInMinutes);
     await this.locators.timeEstimateInput().press("Tab")

    // Handle dropdown selections
    await this.actUtils.selectFromDropdown(this.locators.contentOwnerDropdown(),details.ContentOwnerOrganization);
    await this.actUtils.selectContentPOCDropdown(this.locators.contentPOCDropdown(),details.ContentPOC);
    // Click Save
    await this.locators.saveButton().click();

   
  }

  async contentDetailsExists(){
        try{

            console.log("Waiting for Content Block screen to be appear")
            await expect(this.contentDetailsScreen).toBeVisible();
             //await this.page.waitForLoadState('domcontentloaded', { timeout: 200000 });
            //await this.contentDetailsScreen.waitFor({ state: 'visible' , timeout: 200000})
        }catch(error){
            console.log(`Error while checking the created content block: ${error}`);
        }
    }
  
    
}