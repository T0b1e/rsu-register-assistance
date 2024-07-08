from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.microsoft import EdgeChromiumDriverManager
import time as time_module

def get_data():
    # Set up the Edge WebDriver with options
    options = webdriver.EdgeOptions()
    options.use_chromium = True  # Use the Chromium version of Edge
    options.add_argument("--disable-gpu")  # Disable GPU acceleration (optional)
    options.add_argument("--no-sandbox")  # Bypass OS security model (optional)
    options.add_argument("--headless")  # Run in headless mode (optional)

    browser = webdriver.Edge(service=webdriver.EdgeService(EdgeChromiumDriverManager().install()), options=options)

    # Open the target URL
    browser.get('https://service.rsu.ac.th/GetIntranet/LoginAuthenPages.aspx')

    # Allow the page to load
    time_module.sleep(2)  # Adjust the sleep time as needed

    # Find the username input field and enter the username
    username_input = browser.find_element(By.ID, 'txtUsername')
    username_input.send_keys('u6505065')

    # Find the password input field and enter the password
    password_input = browser.find_element(By.ID, 'txtPassword')
    password_input.send_keys('.Na592600')

    # Find the login button and click it
    login_button = browser.find_element(By.ID, 'Button1')
    login_button.click()

    # Wait for the next page to load
    WebDriverWait(browser, 10).until(EC.url_to_be('https://service.rsu.ac.th/GetIntranet/Default.aspx'))

    # Find and click the desired link
    desired_link = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.LINK_TEXT, 'จำนวนนักศึกษาที่ลงทะเบียนแยกตามรายวิชาที่เปิดสอน'))
    )
    desired_link.click()

    # Wait for the new page to load
    WebDriverWait(browser, 10).until(EC.url_to_be('https://service.rsu.ac.th/GetIntranet/StudentSeatPerSubject.aspx'))

    # Enter academic year
    academic_year_input = browser.find_element(By.ID, 'ContentPlaceHolder1_txtAcademicYear')
    academic_year_input.clear()
    academic_year_input.send_keys('2567')

    # List of subject codes to search
    subject_codes = ['CPE432', 'CPE361', 'CPE308', 'CPE332', 'CPE326', 'IEN301']

    capacity_output = []
    reserved_output = []
    confirmed_output = []
    total_output = []

    for subject_code in subject_codes:
        print(f"\nSearching for subject code: {subject_code}")
        
        # Enter subject code
        subject_code_input = browser.find_element(By.ID, 'ContentPlaceHolder1_txtSubjCode')
        subject_code_input.clear()
        subject_code_input.send_keys(subject_code)

        # Click the submit button
        submit_button = browser.find_element(By.ID, 'ContentPlaceHolder1_Button2')
        submit_button.click()

        # Wait for the table to load
        try:
            WebDriverWait(browser, 10).until(EC.presence_of_element_located((By.ID, 'ContentPlaceHolder1_GridView1')))
        except:
            print(f"No data found for subject code: {subject_code}")
            continue

        # Find all rows in the table
        rows = browser.find_elements(By.XPATH, "//table[@id='ContentPlaceHolder1_GridView1']/tbody/tr[position()>1]")

        # Loop through each row and extract data
        for row in rows:
            columns = row.find_elements(By.TAG_NAME, 'td')
            capacity = columns[2].text
            reserved = columns[3].text
            confirmed = columns[4].text
            total = columns[5].text

            capacity_output.append(capacity)
            reserved_output.append(reserved)
            confirmed_output.append(confirmed)
            total_output.append(total)

        time_module.sleep(2)  # Wait a bit before searching for the next subject code

    # Search for the additional subject code 'CPE327'
    additional_subject_code = 'CPE327'
    print(f"\nSearching for additional subject code: {additional_subject_code}")

    # Enter the additional subject code
    subject_code_input = browser.find_element(By.ID, 'ContentPlaceHolder1_txtSubjCode')
    subject_code_input.clear()
    subject_code_input.send_keys(additional_subject_code)

    # Select the radio button
    radio_button = browser.find_element(By.ID, 'ContentPlaceHolder1_RadioButtonList1_1')
    radio_button.click()

    # Click the submit button
    submit_button = browser.find_element(By.ID, 'ContentPlaceHolder1_Button2')
    submit_button.click()

    # Wait for the table to load
    try:
        WebDriverWait(browser, 10).until(EC.presence_of_element_located((By.ID, 'ContentPlaceHolder1_GridView2')))
    except:
        print(f"No data found for subject code: {additional_subject_code}")

    # Find all rows in the table
    rows = browser.find_elements(By.XPATH, "//table[@id='ContentPlaceHolder1_GridView2']/tbody/tr[position()>1]")

    # Loop through each row and extract data
    for row in rows:
        columns = row.find_elements(By.TAG_NAME, 'td')
        capacity_output.append(columns[2].text)
        reserved_output.append(columns[3].text)
        confirmed_output.append(columns[4].text)
        total_output.append(columns[5].text)

    # Close the browser
    browser.quit()

    # print(capacity_output)
    # print(reserved_output)
    # print(confirmed_output)
    # print(total_output)

    print('Finishing Data Mining')
    return [capacity_output, reserved_output, confirmed_output, total_output]


def connect_google_sheet(capacity, reserved, confirmed, total):
    import gspread
    from google.oauth2.service_account import Credentials

    # Define the scope
    scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]

    # Provide the path to the service account JSON file
    credentials = Credentials.from_service_account_file("rsu-enroll-assistance-79177bd9b5df.json", scopes=scope)

    # Authorize the client
    gc = gspread.authorize(credentials)

    # Open a worksheet from a spreadsheet using the URL
    spreadsheet_url = "https://docs.google.com/spreadsheets/d/1yleU7Z0U4QLq1cSqkzDsI3XwhYSSSuGnhNr70jLg5Aw/edit#gid=0"
    spreadsheet = gc.open_by_url(spreadsheet_url)
    worksheet = spreadsheet.sheet1  # Or use `worksheet = spreadsheet.get_worksheet(index)` for a specific sheet

    # Validation of data lengths
    if len(capacity) == len(reserved) == len(confirmed) == len(total):
        print('Start Writing')

        # Update reserved
        for i, value in enumerate(reserved, start=2):
            worksheet.update_cell(i, 11, value)  # Column K is 11th column

        # Update confirmed
        for i, value in enumerate(confirmed, start=2):
            worksheet.update_cell(i, 12, value)  # Column L is 12th column

        # Update total
        for i, value in enumerate(total, start=2):
            worksheet.update_cell(i, 13, value)  # Column M is 13th column

        print('Done Writing')
    else:
        print("Data length mismatch among capacity, reserved, confirmed, and total")


data = get_data()

capacity = data[0]
reserved = data[1]
confirmed = data[2]
total = data[3]

connect_google_sheet(capacity, reserved, confirmed, total)
