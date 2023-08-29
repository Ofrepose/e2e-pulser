

class PlayWright {
  constructor(browserType) {
    this.browserType = browserType;
    this.browser = null;
    this.page = null;
    this.testResults = [];
    this.testName = '';
    this.projectId = ''
    this.screenshots = [];
  }

  async start(url, testName, projectId) {
    this.testName = testName;
    this.browser = await this.browserType.launch();
    this.page = await this.browser.newPage();
    this.projectId = projectId;
    const testResult = { testName, passed: true, error: null };
    try {
      await this.page.goto(url, { timeout: 10000 });
      await this.captureScreenshot(testName, 'start');
    } catch (error) {
      testResult.passed = false;
      testResult.error = error.message;
      this.testResults.push(testResult);
      await this.captureScreenshot(testName, 'start-Error');
    }
  }

  async captureScreenshot(testName, stepName) {
    const now = Math.floor(new Date().getTime() / 1000);
    const fileName = `${this.projectId}-${testName}-${stepName}-${now.toString()}.png`.replace(/\s+/g, '-');
    const path = `screenshots/${fileName}`;
    await this.page.screenshot({ path });
    this.screenshots.push(fileName)
  }

  async getPageTitle() {
    return await this.page.title();
  }

  async textExistsOnPage(expectedText) {
    try {
      await this.page.waitForSelector(`:text("${expectedText}")`, { timeout: 3000 });

      // this is bad. fix.
      // highlight the text element
      // await this.page.evaluate((text) => {
      //   const elements = Array.from(document.querySelectorAll('*')).filter(element =>
      //     element.textContent.includes(text)
      //   );

      //   elements.forEach((element) => {
      //     const textContent = element.textContent;
      //     const highlightedText = `<span style="background-color: yellow; font-weight: bold;">${text}</span>`;
      //     const modifiedContent = textContent.replace(new RegExp(text, 'g'), highlightedText);
      //     element.innerHTML = modifiedContent;
      //   });
      // }, expectedText);

      // Capture screenshot with the highlighted text
      await this.captureScreenshot(this.testName, 'text-exists');
    } catch (error) {
      console.log(error);
      await this.captureScreenshot(this.testName, 'text-exists');
      throw new Error(`Text: "${expectedText}" not found on the page`);
    }
  }

  async waitForTitle(expectedTitle, timeout) {
    try {
      await this.page.waitForSelector('title', { timeout: 3000 });
      await this.page.waitForFunction(`document.title === "${expectedTitle}"`, { timeout });
      await this.captureScreenshot(this.testName, 'wait-for-title');
    } catch (err) {
      await this.captureScreenshot(this.testName, 'wait-for-title');
      throw new Error(`"${expectedTitle}" not found on the page`);
    }
  }

  async fillFormFieldByPlaceholder(placeholder, value) {
    try {
      const field = await this.page.waitForSelector(`input[placeholder="${placeholder}"]`, { timeout: 3000 });
      await field.fill(value);
      await this.captureScreenshot(this.testName, 'form-placeholder');
    } catch (err) {
      await this.captureScreenshot(this.testName, 'form-placeholder');
      throw new Error(`Input Placeholder: "${placeholder}" not found on the page`);
    }
  }

  async fillFormFieldByName(name, value) {
    try {
      const field = await this.page.waitForSelector(`input[name="${name}"]`, { timeout: 3000 });
      await field.fill(value);
      await this.captureScreenshot(this.testName, 'form-name');
    } catch (err) {
      await this.captureScreenshot(this.testName, 'form-name');
      throw new Error(`Input Name: "${name}" not found on the page`);
    }
  }

  async fillFormDynamic(value, identifierKey, identifierValue = null) {
    const identifierKeyGroupA = ['name', 'placeholder', 'type', 'customAttribute', 'id'];
    // id, class,
    let field;
    try {
      if (identifierKeyGroupA.includes(identifierKey)) {
        field = await this.page.waitForSelector(`input[${identifierKey}="${identifierValue}"]`, { timeout: 10000 });
      } else if (identifierKey === 'id') {
        console.log(`'#${identifierValue}'`);
        field = await this.page.waitForSelector(`'#${identifierValue}'`, { timeout: 10000 });
      } else if (identifierKey === 'class') {
        field = await this.page.waitForSelector(`'.${identifierValue}'`, { timeout: 10000 });
      }
      await field.fill(value);
    } catch (err) {
      await this.captureScreenshot(this.testName, `form-${identifierKey}-${identifierValue}`);
      console.log(err);

      // Listen for console events
      this.page.on('console', async consoleMessage => {
        const args = await Promise.all(consoleMessage.args().map(arg => arg.jsonValue()));
        console.log('Console Log:', args);
      });

      throw new Error(`Input ${identifierKey}: "${identifierValue}" not found on the page`);
    }
  }

  // TODO: Add all kinds of submit buttons. right now relying on the submit button to have the type attribute. thats not a given.
  async submitForm() {
    try {
      const submitButton = await this.page.waitForSelector('button[type="submit"]', { timeout: 3000 });
      await this.captureScreenshot(this.testName, 'form-submit');
      await submitButton.click();
    } catch (err) {
      await this.captureScreenshot(this.testName, 'form-submit');
      throw new Error(`Could not submit form.`);
    }
  }

  async waitForTimeout(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  async checkForWord(expectedWord) {
    try {
      await this.page.waitForSelector(`:text("${expectedWord}")`, { timeout: 3000 });
      await this.captureScreenshot(this.testName, 'check-word');
    } catch (err) {
      await this.captureScreenshot(this.testName, 'check-word');
      throw new Error(`Text: "${expectedWord}" not found on the page`);
    }
  }

  async runTest(testName, callback) {
    const testResult = { testName, passed: true, error: null, screenshots: [] };
    try {
      await callback();
    } catch (error) {
      testResult.passed = false;
      testResult.error = error.message;
    }
    testResult.screenshots = this.screenshots;
    this.testResults.push(testResult);
  }

  async cleanup() {
    await this.browser.close();
    this.printTestResults();
  }

  printTestResults() {

    console.log('\nTest Results:');
    this.testResults.forEach((result, index) => {
      const status = result.passed ? 'PASSED' : 'FAILED';
      // console.log(`${index + 1}. ${result.testName}: ${status}`);
      if (!result.passed) {
        console.log(`   Error: ${result.error}`);
      }
    });
    // console.log(this.testResults);
    const finalResults = this.testResults;
    const finalScreenshots = this.screenshots;
    this.testResults = [];
    this.screenshots = [];
    this.projectId = '';
    return finalResults;
  }
}

module.exports = PlayWright;