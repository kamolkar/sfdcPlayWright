import { test, expect } from '@playwright/test';
import { ContentBlockPage } from '../../pages/designerpages/contentblockpage';
import { LoginPage } from '../../pages/loginpage';
import {TestConfig} from '../../test.config'
import { HomePage } from '../../pages/homepage';
import {AssetsPage } from '../../pages/designerpages/assetspage'
import {generateDynamicTestData} from '../../utils/dataGenerator'


let loginpage: LoginPage;
let homepage: HomePage;
let assetspage:AssetsPage;
let contentblockpage:ContentBlockPage

 const config = new TestConfig();

test.beforeEach(async ({ page }) => {
   
    //await page.goto(config.ACT2QA_SANDBOXURL);
    await page.goto(config.ACT2QA_SANDBOXADMINURL);
    loginpage = new LoginPage(page);
    homepage = new HomePage(page);
    assetspage=new AssetsPage(page);
    contentblockpage=new ContentBlockPage(page);
 
});

test.afterEach(async ({ page }) =>{

    await page.close();
});

test('Verify Content Block Asset Creation @regression', async({page}, testInfo) => {
    //Enter valid credentials 
    //await loginpage.login(config.ACT2QA_USERNAME, config.ACT2QA_PASSWORD);
    await loginpage.login(config.ACT2QA_ADMINUSERNAME, config.ACT2QA_ADMINPASSWORD);

    
    // verify successful login by checking AppLauncher
    const isLoggedIn=await homepage.isAppLauncherExists();
    expect(isLoggedIn).toBeTruthy();

    // ACT Learning Admin selection from App AppLauncher
    await homepage.searchAndClickApp(config.AppACTLearningAdmin);
     // Assets - Event - Selection
    await assetspage.clickAssetsAndNew();
    await expect(assetspage.screenNewAsset).toBeVisible();

    console.log(`Asset type :${config.CBAssetType}`)
    await assetspage.NewAssetSelectionSteps(config.CBAssetType);

    // Read data from Content Block test data json 
    const jsonPath="./testdata/ContentBlockTestData.json"
    const generatedData = generateDynamicTestData(jsonPath);
    const rootRecord=generatedData[0]
    console.log("ROOT DATA:", rootRecord); 
    const contentBlockTestData=rootRecord.ContentBlockCreation;
    console.log("Content Block Test Data:", contentBlockTestData); 
    console.log("Number of fields-ContentBlock Data:", Object.keys(contentBlockTestData).length);
    
    // test data log
   testInfo.annotations.push({ 
    type: 'Content Block Test Data', 
    description: `\n${JSON.stringify(contentBlockTestData, null, 2)}` 
});
    
    // Check for multiple data and create content block
    const contenBlockData = Array.isArray(contentBlockTestData) 
    ? contentBlockTestData 
    : [contentBlockTestData];
    
if (contenBlockData.length > 0) {
    for (const [index, contentBlock] of contenBlockData.entries()) {
        if (index > 0) {
           // Assets - Content Block - Selection
            await assetspage.clickAssetsAndNew();
            await expect(assetspage.screenNewAsset).toBeVisible();
            await assetspage.NewAssetSelectionSteps(config.CBAssetType);
        }
        await contentblockpage.createContentBlock(contentBlock)
        // validate content block creation
        expect(contentblockpage.contentDetailsExists).toBeTruthy();
        const createdRecord=await contentblockpage.createdRecordHeading.innerText();
        expect(createdRecord.trim()).toBe(contentBlock.AssetName);
    }};
    

});