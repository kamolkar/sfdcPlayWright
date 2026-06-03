import{test, expect} from '@playwright/test'
import { LoginPage } from '../pages/loginpage';
import {TestConfig} from '../test.config'
import { HomePage } from '../pages/homepage';

let config:TestConfig;
let loginpage: LoginPage;
let homepage: HomePage;

//
test.beforeEach(async ({ page }) => {
    config = new TestConfig();
    //await page.goto(config.ACT2QA_SANDBOXURL);
     await page.goto(config.ACT2QA_SANDBOXADMINURL);
    loginpage = new LoginPage(page);
    homepage = new HomePage(page);
});

test.afterEach(async ({ page }) =>{
    await page.close();
});


test('User login test', async({page}) => {
    //Enter valid credentials 
    //await loginpage.login(config.ACT2QA_USERNAME, config.ACT2QA_PASSWORD);
     await loginpage.login(config.ACT2QA_ADMINUSERNAME, config.ACT2QA_ADMINPASSWORD);
    // pausing to enter verification code
    //await page.pause();
    
    // verify successful login by checking AppLauncher
    const isLoggedIn=await homepage.isAppLauncherExists();
    expect(isLoggedIn).toBeTruthy();

});