import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  // timeout: 10000,
  // globalTimeout: 60000,
  // expect: {
  //   timeout: 20000
  // },
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html','list'],
    ['json', {outputFile: 'test-results/json-file.json'}],
    ['junit', {outputFile: 'test-results/junit-file.xml'}]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://127.0.0.1:3000',
    globalQaURL: 'https://www.globalsqa.com',
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    // actionTimeout: 10000,
    // navigationTimeout: 10000,
    extraHTTPHeaders: {
      'Authorization' : `Token ${process.env.ACCESS_TOKEN}`
    },
    video: {
      mode: 'off',
      size: {
        width: 1920,
        height: 1080
      }
    }
  },

  globalSetup: require.resolve('./global-setup.ts'),
  globalTeardown: require.resolve('./global-teardown.ts'),

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: 'auth.setup.ts'
    },

    {
      name: 'articleSetup',
      testMatch: 'newArticle.setup.ts',
      use: { 
        ...devices['Desktop Chrome'], 
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
      teardown: 'articleCleanUp'
    },

    {
      name: 'articleCleanUp',
      testMatch: 'articleCleanUp.setup.ts',
      use: { 
        ...devices['Desktop Chrome'], 
        storageState: '.auth/user.json',
      }
    },

    {
      name: 'likesCounter',
      testMatch: 'likesCounter.spec.ts',
      use: { 
        ...devices['Desktop Chrome'], 
        storageState: '.auth/user.json',
      },
      dependencies: ['articleSetup'],
    },

    {
      name: 'likesCounter',
      testMatch: 'likesCounter.spec.ts',
      use: { 
        ...devices['Desktop Chrome'], 
        storageState: '.auth/user.json',
      },
      dependencies: ['articleSetup'],
    },

    {
      name: 'likesCounterGlobal',
      testMatch: 'likesCounterGlobal.spec.ts',
      use: { 
        ...devices['Desktop Chrome'], 
        storageState: '.auth/user.json',
      }
    },

    {
      name: 'stg',
      use: { 
        ...devices['Desktop Chrome'], 
        storageState: '.auth/user.json',
        baseURL: 'www.stg.com'
      },
      dependencies: ['setup'],
      fullyParallel: true,
      
    },

    {
      name: 'chromium',
      use: { storageState: '.auth/user.json' },
      dependencies: ['setup'],
      fullyParallel: true
    },

    {
      name: 'firefox',
      use: { browserName: 'firefox', storageState: '.auth/user.json' },
      dependencies: ['setup']
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: '.auth/user.json' },
      dependencies: ['setup']
    },

    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: { 
        ...devices['iPhone 13']
      }
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
