import {Page,Locator, expect} from 'playwright/test';
import {SessionPage} from '../pages/designerpages/sessionpage'
import { TIMEOUT } from 'dns';

export class HomePage{
     readonly page: Page;

    //Define Locators
     readonly btnAppLauncher: Locator;
     readonly searchApps: Locator;
     readonly ACTLearningAdmin: Locator;
     readonly btnLogout: Locator;
     readonly searchList: Locator;

    //intialize locators with CSS selectors
    constructor(page: Page){
        this.page=page;
        this.btnAppLauncher=page.getByRole('button', { name: 'App Launcher' });
        this.btnLogout=page.getByRole('link', { name: 'Log out' });
        this.searchApps=page.getByLabel('Search apps and items...');
        this.ACTLearningAdmin=page.locator('b:has-text("ACT Learning Admin")');
        this.searchList=page.getByPlaceholder('Search this list...');
        
    
    }

    /*checks AppLauncher exists for successful login */
    async isAppLauncherExists(): Promise<boolean>{
        try{
        await this.page.waitForLoadState('domcontentloaded', { timeout: 90000 });    
        const isVisible=await this.btnAppLauncher.isVisible({ timeout: 60000 });
        return isVisible
        } catch(error){
            console.log(`Error checking the AppLauncher visibility after login: ${error}`);
            return false;
        }
}
    
    // search ACT Learning Admin and click on it
    async searchAndClickApp(appName:string){
        //await this.page.waitForLoadState('domcontentloaded');
        await expect(this.btnAppLauncher).toBeVisible();
        await this.btnAppLauncher.click()
        await this.searchApps.waitFor({ state: 'visible', timeout: 8000});
        await this.searchApps.click();
        await this.searchApps.fill(appName)
        await this.ACTLearningAdmin.waitFor({ state: 'visible', timeout: 8000});
        await this.ACTLearningAdmin.click()

    }

    async searchCreatedRecord(createdRecord:string){
        //await this.page.waitForLoadState('domcontentloaded', { timeout: 90000 });
        await expect(this.searchList).toBeVisible();
        await this.searchList.click();
        await this.searchList.fill(createdRecord);
        await this.searchList.press("Enter");
        //await this.page.waitForLoadState('domcontentloaded', { timeout: 90000 });
    }
    getSearchResult(createdRecord:string) {
        return this.page.locator(`a[title='${createdRecord}'] slot span`);
    }

    async clickRecordAndOpenInNewTab(createdRecord: string): Promise<void>{
        //await this.page.waitForLoadState('domcontentloaded');
        const createdRecordResult=this.page.locator(`a[title='${createdRecord}'] slot span`).first();
        await expect(createdRecordResult).toBeVisible();
        await createdRecordResult.scrollIntoViewIfNeeded();
        createdRecordResult.click()
        await this.page.waitForLoadState('domcontentloaded',{timeout:220000});

    }

}