import {Page,Locator,expect} from 'playwright/test';

export class LoginPage{
    private readonly page: Page;

    //Locators
    private readonly txtUsername: Locator;
    private readonly txtPassword: Locator;
    private readonly btnLogin: Locator;
    readonly txtVerificationCode:Locator;
    readonly btnVerify: Locator;
    readonly globalSearch:Locator;
    readonly selectUser:Locator;
    readonly userDetail:Locator;
    readonly setUpScreen:Locator;
    readonly loginBtn:Locator;
    readonly assetsTab:Locator;

    //intialize locators with CSS selectors
    constructor(page: Page){
        this.page=page;
        this.txtUsername=page.locator('#username');
        this.txtPassword=page.locator('#password');
        this.btnLogin= page.locator('#Login');
        this.txtVerificationCode=page.getByRole('textbox', { name: 'Verification Code' });
        this.btnVerify=page.getByTitle('Verify');
        this.globalSearch=page.getByRole('button', { name: 'Search' });
        this.selectUser=page.getByText('User • Consultant - QA Engineer', { exact: true });
        this.userDetail=page.locator("li[data-target-selection-name='sfdc:StandardButton.User.LinkToSetupUserDetailAction'] div[title='User Detail']")
        this.setUpScreen=page.locator('a:has-text("SETUP")');
        this.loginBtn=page.frameLocator('[name^="vfFrameId_"]').locator('#topButtonRow').locator('input').nth(3)
        this.assetsTab=page.getByRole('link', { name: 'Assets' })
    }
    /*sets username in the username text field  */
    async setUsername(username:string){
        await this.txtUsername.fill(username)
    }
     /*sets password in the password text field  */
     async setPassword(password:string){
        await this.txtPassword.fill(password)
    }
     /*click on Login button  */
    async clickLogin(){
        await this.btnLogin.click()
    }

    async login(username:string,password:string){
        await this.setUsername(username);
        await this.setPassword(password);
        await this.clickLogin();
        await this.loginViaAdminProfile();
    }

    async enterMFACode(MFACode:string){
        await this.txtVerificationCode.fill(MFACode);
        await this.btnVerify.click();

    }

    async loginViaAdminProfile(){
        await expect(this.globalSearch).toBeVisible();
        await this.globalSearch.click();
        await this.selectUser.click();
        await expect(this.userDetail).toBeVisible({ timeout: 30000 });
        await this.userDetail.scrollIntoViewIfNeeded();
        await this.userDetail.click();
        await expect(this.loginBtn).toBeVisible();
        await this.loginBtn.click();
        await expect(this.assetsTab).toBeVisible();



    }
}