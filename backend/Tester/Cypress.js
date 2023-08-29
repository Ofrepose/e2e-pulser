const { execSync } = require('child_process');
const Main = require('../Main');
const cypress = require('cypress')

class Cypress {
    constructor() {

    }

    async runCypressTests() {
        let results;
        try {
            results = await cypress.run({
                // reporter: 'junit',
                browser: 'chrome',
                config: {
                //   baseUrl: 'http://localhost:5001',
                  video: true,
                }
              });
              console.log(results.runs[0].tests)
        } catch (error) {
            console.error(error);

        }
    }


    // dynamic test setup
    testForWord = async ({ url, textExpected }) => {
        console.log('TESTING IN DYNAMIC SMOKE TEST')
        it(`should visit ${url} and check for ${textExpected} to be on page`, () => {
            // Visit the website
            try {
                console.log(url)
                cy.visit(url);
                // Use should() to wait for the textExpected to be present
                cy.contains(textExpected).should('be.visible');

                // This assertion will now only execute after the text is visible on the page
                cy.log(`${textExpected} is visible on the page`);
            } catch (err) {
                // log error in url
                Main.Logger.logTestError('testForWord', details={
                    error: err,
                    url
                })
            }          


        });
    };


}

module.exports = Cypress;