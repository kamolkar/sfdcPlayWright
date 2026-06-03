import {Page,Locator,expect} from 'playwright/test';

export class AssetsPage{
     readonly page: Page;

    //Define Locators
     readonly tabAssets: Locator;
     readonly btnNew: Locator;
     readonly screenNewAsset : Locator;
     readonly Nextbtn: Locator;
     readonly recentlyViewedDropdown: Locator;
     readonly recentlyViewedOption:Locator;
     readonly assetEventScreen:Locator;

    //intialize locators 
    constructor(page: Page){
        this.page=page;
        this.tabAssets=page.getByRole('link', { name: 'Assets' });
        this.btnNew=page.locator("//div[@title='New']");
        this.screenNewAsset=page.getByRole('heading', { name: 'New Asset' });
        this.Nextbtn=page.getByRole('button', { name: 'Next' })
        this.recentlyViewedDropdown=page.locator("button[title='Select a List View: Assets'] lightning-primitive-icon[exportparts='icon'] svg");
        this.recentlyViewedOption=page.getByTitle('Recently Viewed (Pinned list)');
        this.assetEventScreen=page.getByRole('heading', { name: 'New Asset: Event' });
    
        
    }

    async clickAssetsAndNew(){
        await this.tabAssets.click()
        await this.btnNew.click()  
        await expect(this.screenNewAsset).toBeVisible();  
        
}

    // Select Asset Type 
    async selectAssetRadioBtn(assetType: string) {
    const locator = this.page.locator(`//span[@class='slds-form-element__label topdown-radio--label'][normalize-space()='${assetType}']`);
    await expect(locator).toBeVisible();
    await locator.check();
    
}
    // to click on hidden buttons
    async clickNextBtn(){
        await this.Nextbtn.evaluate((el: HTMLElement) => {
        el.style.display = 'block';
        el.style.visibility = 'visible';
        el.click();
});

}

    
 // Asset type selection steps
    async NewAssetSelectionSteps(assetType :string){
        // Event Radio Btn selection
        await this.selectAssetRadioBtn(assetType)
        //await this.page.waitForLoadState('domcontentloaded', { timeout: 200000 });
        //await this.page.getByRole('button', { name: 'Next' }).click({ force: true });
        //await this.btnNext.click()
        await this.Nextbtn.scrollIntoViewIfNeeded();
        await this.Nextbtn.click();
        //await this.page.waitForLoadState('domcontentloaded');
        const assetTypeScreen=this.page.getByRole('heading', { name: `New Asset: ${assetType}` });
        await expect(assetTypeScreen).toBeVisible();
    }

    async navigateRecentlyViewed(){
        await expect(this.tabAssets).toBeVisible();
        await this.tabAssets.click()
        await expect(this.recentlyViewedDropdown).toBeVisible();
        await this.recentlyViewedDropdown.click();
        await this.recentlyViewedOption.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    getAssetSearchResult(assetName:string) {
        return this.page.locator(`a[title='${assetName}'] slot span`);
    }

async closeAssetTab(assetName:string){
        const assetTab=this.page.getByRole('button', { name: `Close ${assetName} | Asset` })
        //await this.page.waitForTimeout(4000)
        await expect(assetTab).toBeVisible();
        await assetTab.click();

    }


}