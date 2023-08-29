class Logger {
    constructor() { }

    logTestError(
        testName,
        details = {
            error,
            url
        }
    ) {
        console.warn('send this error to log/db for test');
        console.error(testName, details.error, details.url)
    }
}

module.exports = Logger;