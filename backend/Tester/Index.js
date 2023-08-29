// const Cypress = require('./Cypress');
const PlayWright = require('./PlayWrightTests');
const { chromium } = require('playwright');

class Tester {
    constructor() {
        this.PlayWright = new PlayWright(chromium);
    }

    async e2eTest() {
        console.log('starting e2e tests')
        const test = this.PlayWright;
        try {
            await test.start('https://leadpulser.com');

            await test.runTest('HomePage alive', async () => {
                console.log('Testing: HomePage alive')
                await test.textExistsOnPage('LeadPulser');
            });

            await test.runTest('LeadPulser can log in with demo', async () => {
                console.log('Testing: LeadPulser can log in with demo')
                await test.fillFormFieldByName('email', 'demo@leadpulser.com');
                await test.fillFormFieldByName('password', 'demodemo');
                await test.submitForm();
                await test.waitForTimeout(5000); // Wait for 5 seconds
                await test.checkForWord('Lead Pulser | Daniel');
            })
        } catch (err) {
            console.log(err);
        } finally {
            await test.cleanup();
        }
    }

    // can see text on page
    async testTextOnPage({ test, projectId }) {
        const tester = this.PlayWright;
        try {
            await tester.start(test.args.targetUrl, test.name, projectId);
            await tester.runTest(test.name, async () => {
                await tester.textExistsOnPage(test.args.targetText);
            });
            const finalResults = tester.printTestResults();
            await tester.cleanup();
            return finalResults;
        } catch (err) {
            console.log(err);
        }
    }

    // can log in
    // ARGS:
    //     data: {
    //         targetUrl: '',
    //         targetText: '',
    //         inputNameForUserName: '',
    //         userNameForTest: '',
    //         p_forTest: '',
    //         inputNameForPassword: '',
    //     }
    async testCanLogIn({ test, projectId }) {
        const tester = this.PlayWright;
        const args = test.args;
        try {
            await tester.start(args.targetUrl, test.name, projectId);
            await tester.runTest(test.name, async () => {
                console.log(`Testing: ${test.name}`)

                await tester.fillFormFieldByName(args.inputNameForUserName, args.userNameForTest);
                await tester.fillFormFieldByName(args.inputNameForPassword, args.p_forTest);
                await tester.submitForm();
                await tester.waitForTimeout(5000); // Wait for 5 seconds
                await tester.textExistsOnPage(args.targetText);
            });
            const finalResults = tester.printTestResults();
            console.log(finalResults);
            await tester.cleanup();
            return finalResults;
        } catch (err) {
            console.log(err);
        }
    }

    // async fillFormDynamic(value, identifierKey, identifierValue=null)
    async testDynamicForm({ test, projectId }){
        const tester = this.PlayWright;
        const args = test.args;

        console.log(test.args.customAttributes);
        try {
            await tester.start(args.targetUrl, test.name, projectId);
            await tester.runTest(test.name, async () => {
                console.log(`Testing: ${test.name}`)
                for(let field of test.args.customAttributes){
                    await tester.fillFormDynamic(field.value, field.identifierKey, field.identifierValue);
                }
                await tester.submitForm();
                await tester.waitForTimeout(5000); // Wait for 5 seconds
                await tester.textExistsOnPage(args.targetText);
            });
            const finalResults = tester.printTestResults();
            console.log(finalResults);
            await tester.cleanup();
            return finalResults;
        } catch (err) {
            console.log(err);
        }
    }


}

module.exports = Tester;