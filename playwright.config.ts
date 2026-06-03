import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
//dotenv.config();
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* --- GLOBAL TIMEOUTS [3 minutes]--- */
  timeout: 180 * 1000, 
  expect: {
    /**
     * Timeout for each assertion (expect)- 2minutes.
     * This is how long Playwright will retry an assertion like toBeVisible()
     */
    timeout: 120 * 1000, 
  },

  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  retries: 0,
  workers: 1,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['allure-playwright'],
    ['dot'],
    ['list']
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    /* --- ARTIFACTS & DEBUGGING --- */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    /* --- NAVIGATION & NETWORK --- */ 
    ignoreHTTPSErrors: true,
    actionTimeout: 90 * 1000,
    navigationTimeout: 100 * 1000,

    /* --- BROWSER UI & VIEWPORT --- */ 
    headless: false,
    viewport: { width: 1920, height: 1080 },
    
    /* --- PERMISSIONS & LOCALE --- */ 
    permissions: ['geolocation']
  },

  /* Configure projects for major browsers */
  projects: [
    // 1. Define the Setup Project
    // {
    //   name: 'setup',
    //   testMatch: 'authSetup.ts',
    // },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'],
        // Tell this project to use the storage state created by 'setup'
       // storageState: 'playwright/.auth/user.json',
       },

      //dependencies: ['setup'], // Ensures setup runs first
    },
   
  
  ],
});