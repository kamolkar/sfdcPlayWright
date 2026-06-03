import { test, expect,type Page } from '@playwright/test'
import { LoginPage } from '../../pages/loginpage';
import { TestConfig } from '../../test.config'
import { HomePage } from '../../pages/homepage';
import { AssetsPage } from '../../pages/designerpages/assetspage'
import { CourseEventPage } from '../../pages/designerpages/courseeventpage'
import { SessionPage } from '../../pages/designerpages/sessionpage'
import { generateDynamicTestData } from '../../utils/dataGenerator'
import { SessionRolesPage } from '../../pages/designerpages/sessionrolespage';
import { ACTUtils } from '../../utils/actUtils';

const testScenarios = [
    { type: 'Physical', path: './testdata/CourseEvent_PhysicalSessions.json', TestDataName: 'CourseEventFlow' },
    { type: 'Virtual', path: './testdata/CourseEvent_VirtualSessions.json', TestDataName: 'CourseEventFlow' },
    { type: 'Hybrid', path: './testdata/CourseEvent_HybridSessions.json', TestDataName: 'CourseEventFlow' },
    { type: 'Physical', path: './testdata/StandaloneEvent_PhysicalSessions.json', TestDataName: 'StandaloneEventFlow' },
    { type: 'Virtual', path: './testdata/StandaloneEvent_VirtualSessions.json', TestDataName: 'StandaloneEventFlow' },
    { type: 'Hybrid', path: './testdata/StandaloneEvent_HybridSessions.json', TestDataName: 'StandaloneEventFlow' }
];

for (const scenario of testScenarios) {
test.describe(`Scenario - ${scenario.TestDataName} @regression`, () => {
    test.describe.configure({ mode: 'serial' });
    let page: Page;
    let loginpage: LoginPage;
    let homepage: HomePage;
    let assetspage: AssetsPage;
    let courseeventpage: CourseEventPage;
    let sessionpage: SessionPage;
    let sessionrolespage: SessionRolesPage;
    let actutils:ACTUtils;

    const config = new TestConfig();
    // const jsonPath = "./testdata/CourseEventTestData.json";
    console.log("test data json path :",scenario.path);
    const generatedData = generateDynamicTestData(scenario.path);
    const rootRecord = generatedData[0];
    const courseEventTestData = rootRecord[scenario.TestDataName];
    // Extract only the course data (excluding Sessions)
    const { Sessions, ...courseOnlyData } = courseEventTestData;

    test.beforeAll(async ({ browser }) => {
        
        const context = await browser.newContext();
        page = await context.newPage();

        //await page.goto(config.ACT2QA_SANDBOXURL);
        await page.goto(config.ACT2QA_SANDBOXADMINURL);
        loginpage = new LoginPage(page);
        homepage = new HomePage(page);
        assetspage = new AssetsPage(page);
        courseeventpage = new CourseEventPage(page);
        sessionpage = new SessionPage(page);
        sessionrolespage = new SessionRolesPage(page);
        actutils=new ACTUtils(page);

       // await loginpage.login(config.ACT2QA_USERNAME, config.ACT2QA_PASSWORD);
        await loginpage.login(config.ACT2QA_ADMINUSERNAME, config.ACT2QA_ADMINPASSWORD);
       
        // verify successful login by checking AppLauncher
        const isLoggedIn = await homepage.isAppLauncherExists();
        expect(isLoggedIn).toBeTruthy();
       
    });

  

    test(`Verify ${courseOnlyData.EventType} Event Creation-${scenario.type} Sessions`, async ({},testInfo) => {
        await homepage.searchAndClickApp(config.AppACTLearningAdmin);
        await assetspage.clickAssetsAndNew();
        console.log(`Event type :${config.EventAssetType}`)
        await assetspage.NewAssetSelectionSteps(config.EventAssetType);
        console.log("Course Event TestData:", courseOnlyData);
        console.log("Number of fields-Course event TestData::", Object.keys(courseOnlyData).length);

        // Test data log
        testInfo.annotations.push({
            type: 'Course Event Test Data',
            description: `\n${JSON.stringify(courseOnlyData, null, 2)}`
        });
        // Action: Fill the course event Deatils
        await courseeventpage.fillAssetDetails(courseOnlyData);
    });

    test(`Verify Adding ${scenario.type} Sessions to ${courseOnlyData.EventType} Event`, async ({}, testInfo) => {
        test.slow();
        const createdCourseEvent = courseOnlyData.AssetName;
        const sessionsData = courseEventTestData.Sessions;
        console.log("Sessions TestData:", sessionsData)
        // Log Test data 
        testInfo.annotations.push({
            type: 'Sessions Test Data',
            description: `\n${JSON.stringify(sessionsData, null, 2)}`
        });
    
        await assetspage.navigateRecentlyViewed();
        console.log("Created course event:", createdCourseEvent)
        await homepage.clickRecordAndOpenInNewTab(createdCourseEvent);
        await courseeventpage.changeEventStatus();
        await sessionpage.clickAddSession();
        // Check for sessions and fill them
        if (sessionsData.length > 0) {
            for (const [index, eachSessionData] of sessionsData.entries()) {
                // click 'Actions' to add more
                if (index > 0) {
                    console.log(`Adding additional session: ${eachSessionData.Name}`);
                    await sessionpage.clickActionsAndAddSession();
                }
                await sessionpage.createSession(eachSessionData);
            }
        };
    });

    test(`Verify Adding Session Roles to ${scenario.type} Sessions`, async ({}, testInfo) => {
        test.slow();
        const createdCourseEvent = courseOnlyData.AssetName;
        const sessionRolesData = courseEventTestData.SessionRoles;
        console.log("Session Role(s) TestData:", sessionRolesData)
        // Log Test data 
        testInfo.annotations.push({
            type: 'Session Role(s) Test Data',
            description: `\n${JSON.stringify(sessionRolesData, null, 2)}`
        });
        await assetspage.navigateRecentlyViewed();
        await homepage.clickRecordAndOpenInNewTab(createdCourseEvent);
        //expect (courseeventpage.isEventDetailsExists()).toBeTruthy();
        const sessionsCount = await sessionpage.getSessionCount()
        console.log("Sessions Count:", sessionsCount);
        if (sessionsCount > 0) {
            for (let i = 0; i < sessionsCount; i++) {
                await sessionpage.clickSessionRow(i);
                if (sessionRolesData.length > 0) {
                    for (const [index, sessionrole] of sessionRolesData.entries()) {
                        await sessionrolespage.addSessionRoles(sessionrole.Role, sessionrole.EmployeeName);
                        await sessionrolespage.closePopup(sessionrolespage.addSessionRoleScreen);
                    }
                        await sessionrolespage.closeSessionRoleTab();
                }
            }
        }
        await assetspage.closeAssetTab(createdCourseEvent);

    })

    test.afterAll(async () => {
        //await actutils.closeAllOpenTabs();
        await page.close();
    });


});
}