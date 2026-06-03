import { Page, Locator, expect } from '@playwright/test';

export class ACTUtils {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // async selectEventTypeDropdown(dropdown: Locator,eventType: string) {
    //     console.log(`Event Type is:${eventType}`)
    //     console.log(this.page.getByTitle(eventType, { exact: true }));
    //     await dropdown.click();
    //     this.page.getByTitle(eventType, { exact: true }).click();
    // }
    // async selectContentOwnerOrgDropdown(dropdown: Locator,ContentOwnerOrg: string) {
    //     console.log(`Content Owner Org is:${ContentOwnerOrg}`)
    //     console.log(this.page.getByTitle(ContentOwnerOrg, { exact: true }))
    //     await dropdown.click();
    //     this.page.getByTitle(ContentOwnerOrg, { exact: true }).click();
    // }

    async selectFromDropdown(dropdown: Locator, optionText: string) {
        console.log(`Selecting option from dropdown: ${optionText}`);
        
        // Open the dropdown
        await dropdown.click();
        //option 1 
        await this.page.locator('role=option', { hasText: new RegExp(`^${optionText}$`) }).click();
        /*
        //option 2
        await this.page.locator('.dropdown-item', { hasText: optionText }).click();
        //option 3 
        const dropDownSelection= this.page.getByTitle(optionText, { exact: true });
        //const option = page.locator('.dropdown-item', { hasText: 'Employee Success' });
        await dropDownSelection.scrollIntoViewIfNeeded();
        await dropDownSelection.click();
        */
    }

    async selectContentPOCDropdown(dropdown: Locator, contentPOC: string) {
        console.log('Content POC is:${contentPOC}')
        console.log(this.page.getByTitle(contentPOC, { exact: true }))
        await dropdown.click();
        //await dropdown.focus();
        //await dropdown.fill(contentPOC);
        //await this.page.keyboard.press(contentPOC);
        await dropdown.pressSequentially(contentPOC, { delay: 100 });
        const dropdownResult=this.page.getByTitle(contentPOC, { exact: true });
        await dropdownResult.first().waitFor({ state: 'visible', timeout: 10000 });
        await dropdownResult.first().click();
    }

    
async closeAllOpenTabs(): Promise<void> {
    try{
    console.log("Closing open Salesforce workspace tabs...");
    const closeButtons = await this.page.getByRole('button', { name: /^Close / }).all();
    console.log(`Found ${closeButtons.length} tab(s) to close.`);
    for (const button of closeButtons.reverse()) {
        // Ensure it's visible/attached before clicking
        if (await button.isVisible()) {
            await button.click({ force: true });
            await this.page.waitForTimeout(2000); 
        }
    }   
    console.log("All matching tabs closed successfully.");
} catch (error) {
    console.log(`Generic tab cleanup encountered an error: ${error}`);
}
     
}

    
async waitForUpdateWithRetry(targetLocator: Locator, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                // Short-wait for visibility to keep the loop moving
                await targetLocator.waitFor({ state: 'visible', timeout: 30000 });
                return; // Exit if found
            } catch (error) {
                if (i < maxRetries - 1) {
                    console.log(`[Salesforce-Retry] Element not found. Refreshing... Attempt ${i + 1}/${maxRetries}`);
                    await this.page.reload({ waitUntil: 'domcontentloaded' });
                    
                    // Wait for the Salesforce 'Loading' spinner to disappear after reload
                    await this.page.locator('.slds-spinner_container')
                        .waitFor({ state: 'hidden', timeout: 60000 })
                        .catch(() => {}); // Catch if spinner never shows
                } else {
                    throw new Error(`[Salesforce-Retry] Element remained hidden after ${maxRetries} refreshes.`);
                }
            }
        }
    }
}