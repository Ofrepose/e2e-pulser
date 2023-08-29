# AutoUpdater & E2E Tester Application

The AutoUpdater & E2E Tester is a versatile tool designed to streamline the management of your project's dependencies, keep you informed about outdated packages, and ensure the functionality of your application through end-to-end (E2E) testing. With the ability to integrate seamlessly with your project's `package.json` file, this application simplifies the process of staying up-to-date, maintaining reliable user journeys, and addressing potential issues.

## Features

- **Dependency Management:**
  - Connect your project's `package.json` file to the application to automatically fetch dependency information from the npm library.
  - Identify the latest versions of your dependencies and compare them with your current versions.
  - Direct links to documentation for each dependency help you access relevant information quickly.

- **Out-of-Date Notifications:**
  - Receive notifications for dependencies that are slightly out-of-date as well as those that are significantly behind the latest version.
  - Stay informed about potential security vulnerabilities and performance improvements in your dependencies.

- **End-to-End (E2E) Testing:**
  - Create and configure frontend E2E smoke tests that replicate user journeys through your application.
  - Auto-run smoke tests to ensure not only the availability of your website but also the proper functioning of user interactions.
  - Detailed test reports include screenshots for each step of the user journey, aiding in diagnosing failures.

- **Automated Dependency Updates:**
  - Utilize the auto dependency updater to intelligently update one package at a time.
  - After each update, automatically run E2E smoke tests to validate the updated package's compatibility with your application.
  - In case of test failures, the application logs the failing point, reverts the package to the previous version, and generates comprehensive reports sent to both the frontend and your email.

## How It Works

1. **Integration:** Link your project's `package.json` file to the application.
2. **Dependency Check:** The application fetches dependency data from the npm library and compares versions.
3. **Notifications:** Receive notifications for different levels of outdated dependencies.
4. **E2E Testing:** Create, configure, and auto-run frontend smoke tests to validate user journeys.
5. **Screenshots:** Test reports include screenshots of each step, aiding in issue identification.
6. **Auto Dependency Updater:** Intelligently update one dependency at a time, followed by E2E testing.
7. **Failure Handling:** If a test fails, the application logs the failure point, reverts the package, and sends reports.
8. **Manual Intervention:** Address issues identified by the application and reports to ensure smooth updates.

## Getting Started

1. Clone the repository and install dependencies.
2. Link your project's `package.json` file to the application.
3. Configure E2E smoke tests for your application's user journeys.
4. Use the auto dependency updater to initiate updates and tests.
5. Monitor notifications and reports to maintain a robust application.

Make the most of the AutoUpdater & E2E Tester to simplify your dependency management, enhance user experience, and ensure the reliability of your application. Your feedback and contributions are welcome to help us improve this tool further.

## Screenshots
[<img src="https://github.com/Ofrepose/Ofrepose/blob/master/imgs/screenshots.gif">](https://github.com/Ofrepose/Ofrepose/blob/master/imgs/screenshots.gif)

## License

This project is licensed under the [MIT License](LICENSE).

---

*Note: The AutoUpdater & E2E Tester Application is currently under development, with certain features being refined and tested. Feedback and contributions are encouraged to help us make this tool even more effective.*
