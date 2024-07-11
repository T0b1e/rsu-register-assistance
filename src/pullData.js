const { Builder, By, until } = require('selenium-webdriver');
const edge = require('selenium-webdriver/edge');
const service = new edge.ServiceBuilder().build();
const options = new edge.Options();

async function getData(headless, username, password) {
    console.log("Starting data extraction...");

    options.addArguments("--disable-gpu", "--no-sandbox");
    if (headless) {
        options.addArguments("--headless");
    }

    const driver = await new Builder().forBrowser('MicrosoftEdge').setEdgeOptions(options).setEdgeService(service).build();

    try {
        console.log("Navigating to login page...");
        await driver.get('https://service.rsu.ac.th/GetIntranet/LoginAuthenPages.aspx');
        await driver.sleep(2000);

        console.log("Entering login credentials...");
        await driver.findElement(By.id('txtUsername')).sendKeys(username);
        await driver.findElement(By.id('txtPassword')).sendKeys(password);
        await driver.findElement(By.id('Button1')).click();

        console.log("Waiting for login to complete...");
        await driver.wait(until.urlIs('https://service.rsu.ac.th/GetIntranet/Default.aspx'), 10000);

        console.log("Navigating to enrollment page...");
        const desiredLink = await driver.wait(until.elementLocated(By.linkText('จำนวนนักศึกษาที่ลงทะเบียนแยกตามรายวิชาที่เปิดสอน')), 10000);
        await desiredLink.click();

        await driver.wait(until.urlIs('https://service.rsu.ac.th/GetIntranet/StudentSeatPerSubject.aspx'), 10000);

        console.log("Setting academic year...");
        const academicYearInput = await driver.findElement(By.id('ContentPlaceHolder1_txtAcademicYear'));
        await academicYearInput.clear();
        await academicYearInput.sendKeys('2567');

        const subjectCodes = ['CPE432', 'CPE361', 'CPE308', 'CPE332', 'CPE326', 'IEN301'];

        let capacityOutput = [], reservedOutput = [], confirmedOutput = [], totalOutput = [];

        for (let subjectCode of subjectCodes) {
            console.log(`Searching for subject code: ${subjectCode}`);
            const subjectCodeInput = await driver.findElement(By.id('ContentPlaceHolder1_txtSubjCode'));
            await subjectCodeInput.clear();
            await subjectCodeInput.sendKeys(subjectCode);

            const submitButton = await driver.findElement(By.id('ContentPlaceHolder1_Button2'));
            await submitButton.click();

            try {
                await driver.wait(until.elementLocated(By.id('ContentPlaceHolder1_GridView1')), 10000);
            } catch (err) {
                console.log(`No data found for subject code: ${subjectCode}`);
                continue;
            }

            const rows = await driver.findElements(By.xpath("//table[@id='ContentPlaceHolder1_GridView1']/tbody/tr[position()>1]"));

            for (let row of rows) {
                const columns = await row.findElements(By.tagName('td'));
                capacityOutput.push(await columns[2].getText());
                reservedOutput.push(await columns[3].getText());
                confirmedOutput.push(await columns[4].getText());
                totalOutput.push(await columns[5].getText());
            }

            await driver.sleep(2000);
        }

        const additionalSubjectCode = 'CPE327';
        console.log(`Searching for additional subject code: ${additionalSubjectCode}`);

        const subjectCodeInput = await driver.findElement(By.id('ContentPlaceHolder1_txtSubjCode'));
        await subjectCodeInput.clear();
        await subjectCodeInput.sendKeys(additionalSubjectCode);

        const radioButton = await driver.findElement(By.id('ContentPlaceHolder1_RadioButtonList1_1'));
        await radioButton.click();

        const submitButton = await driver.findElement(By.id('ContentPlaceHolder1_Button2'));
        await submitButton.click();

        try {
            await driver.wait(until.elementLocated(By.id('ContentPlaceHolder1_GridView2')), 10000);
        } catch (err) {
            console.log(`No data found for subject code: ${additionalSubjectCode}`);
        }

        const rows = await driver.findElements(By.xpath("//table[@id='ContentPlaceHolder1_GridView2']/tbody/tr[position()>1]"));

        for (let row of rows) {
            const columns = await row.findElements(By.tagName('td'));
            capacityOutput.push(await columns[2].getText());
            reservedOutput.push(await columns[3].getText());
            confirmedOutput.push(await columns[4].getText());
            totalOutput.push(await columns[5].getText());
        }

    } finally {
        await driver.quit();
    }

    console.log("Data extraction complete.");
    
    return [capacityOutput, reservedOutput, confirmedOutput, totalOutput];
}

// Usage example
getData(true, 'your_username', 'your_password').then(data => {
    console.log(data);
}).catch(err => {
    console.error(err);
});
