const { Builder, By, until } = require('selenium-webdriver');
const edge = require('selenium-webdriver/edge');
const { ServiceBuilder } = require('selenium-webdriver/edge');
const webdriverManager = require('webdriver-manager');

(async function getData() {
    const service = new ServiceBuilder(webdriverManager.EdgeDriver().install().location).build();
    const driver = new Builder()
        .forBrowser('MicrosoftEdge')
        .setEdgeService(service)
        .build();

    try {
        // Open the target URL
        await driver.get('https://service.rsu.ac.th/GetIntranet/LoginAuthenPages.aspx');

        // Allow the page to load
        await driver.sleep(2000);  // Adjust the sleep time as needed

        // Find the username input field and enter the username
        const usernameInput = await driver.findElement(By.id('txtUsername'));
        await usernameInput.sendKeys('u6505065');

        // Find the password input field and enter the password
        const passwordInput = await driver.findElement(By.id('txtPassword'));
        await passwordInput.sendKeys('.Na592600');

        // Find the login button and click it
        const loginButton = await driver.findElement(By.id('Button1'));
        await loginButton.click();

        // Wait for the next page to load
        await driver.wait(until.urlIs('https://service.rsu.ac.th/GetIntranet/Default.aspx'), 10000);

        // Find and click the desired link
        const desiredLink = await driver.wait(
            until.elementLocated(By.linkText('จำนวนนักศึกษาที่ลงทะเบียนแยกตามรายวิชาที่เปิดสอน')),
            10000
        );
        await desiredLink.click();

        // Wait for the new page to load
        await driver.wait(until.urlIs('https://service.rsu.ac.th/GetIntranet/StudentSeatPerSubject.aspx'), 10000);

        // Enter academic year
        const academicYearInput = await driver.findElement(By.id('ContentPlaceHolder1_txtAcademicYear'));
        await academicYearInput.clear();
        await academicYearInput.sendKeys('2567');

        // List of subject codes to search
        const subjectCodes = ['CPE432', 'CPE361', 'CPE308', 'CPE332', 'CPE326', 'IEN301'];

        const capacityOutput = [];
        const reservedOutput = [];
        const confirmedOutput = [];
        const totalOutput = [];

        for (let subjectCode of subjectCodes) {
            console.log(`\nSearching for subject code: ${subjectCode}`);

            // Enter subject code
            const subjectCodeInput = await driver.findElement(By.id('ContentPlaceHolder1_txtSubjCode'));
            await subjectCodeInput.clear();
            await subjectCodeInput.sendKeys(subjectCode);

            // Click the submit button
            const submitButton = await driver.findElement(By.id('ContentPlaceHolder1_Button2'));
            await submitButton.click();

            // Wait for the table to load
            try {
                await driver.wait(until.elementLocated(By.id('ContentPlaceHolder1_GridView1')), 10000);
            } catch (error) {
                console.log(`No data found for subject code: ${subjectCode}`);
                continue;
            }

            // Find all rows in the table
            const rows = await driver.findElements(By.xpath("//table[@id='ContentPlaceHolder1_GridView1']/tbody/tr[position()>1]"));

            // Loop through each row and extract data
            for (let row of rows) {
                const columns = await row.findElements(By.tagName('td'));
                const subjectCode = await columns[0].getText();
                const theory = await columns[1].getText();
                const capacity = await columns[2].getText();
                const reserved = await columns[3].getText();
                const confirmed = await columns[4].getText();
                const total = await columns[5].getText();
                const day = await columns[6].getText();
                const time = await columns[7].getText();
                const room = await columns[8].getText();
                const note = await columns[9].getText();

                capacityOutput.push(capacity);
                reservedOutput.push(reserved);
                confirmedOutput.push(confirmed);
                totalOutput.push(total);
            }

            await driver.sleep(2000);  // Wait a bit before searching for the next subject code

            console.log(capacityOutput);
            console.log(reservedOutput);
            console.log(confirmedOutput);
            console.log(totalOutput);
        }
    } finally {
        // Close the browser
        await driver.quit();
    }
})();


