import tkinter as tk
from tkinter import ttk, scrolledtext
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.microsoft import EdgeChromiumDriverManager
import time
import threading
import gspread
from google.oauth2.service_account import Credentials

class EnrollmentApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Enrollment Assistance")
        self.root.geometry("800x650")
        self.create_widgets()
    
    def create_widgets(self):
        self.style = ttk.Style()
        self.style.theme_use('clam')
        
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.pack(fill=tk.BOTH, expand=True)

        input_frame = ttk.Frame(main_frame)
        input_frame.pack(fill=tk.X, pady=(0, 20))

        ttk.Label(input_frame, text="Username:").grid(row=0, column=0, padx=(0, 10), sticky="e")
        self.username_var = tk.StringVar(value="u6505065")
        ttk.Entry(input_frame, textvariable=self.username_var).grid(row=0, column=1, sticky="ew")

        ttk.Label(input_frame, text="Password:").grid(row=1, column=0, padx=(0, 10), sticky="e")
        self.password_var = tk.StringVar(value=".Na592600")
        ttk.Entry(input_frame, textvariable=self.password_var, show="*").grid(row=1, column=1, sticky="ew")

        input_frame.columnconfigure(1, weight=1)

        control_frame = ttk.Frame(main_frame)
        control_frame.pack(fill=tk.X, pady=(0, 20))

        self.start_button = ttk.Button(control_frame, text="Start", command=self.start_process)
        self.start_button.pack(side=tk.LEFT, padx=(0, 10))

        self.headless_var = tk.BooleanVar(value=True)
        self.headless_checkbox = ttk.Checkbutton(control_frame, text="Headless", variable=self.headless_var)
        self.headless_checkbox.pack(side=tk.LEFT)

        self.progress = ttk.Progressbar(main_frame, orient=tk.HORIZONTAL, length=100, mode='indeterminate')
        self.progress.pack(fill=tk.X, pady=(0, 20))

        self.log_area = scrolledtext.ScrolledText(main_frame, width=80, height=20)
        self.log_area.pack(fill=tk.BOTH, expand=True)
    
    def log(self, message):
        self.log_area.insert(tk.END, message + "\n")
        self.log_area.see(tk.END)
    
    def start_process(self):
        self.log_area.delete(1.0, tk.END)
        self.start_button.config(state=tk.DISABLED)
        self.progress.start()
        threading.Thread(target=self.run, daemon=True).start()
    
    def run(self):
        try:
            headless = self.headless_var.get()
            username = self.username_var.get()
            password = self.password_var.get()
            data = self.get_data(headless, username, password)
            if data:
                capacity, reserved, confirmed, total = data
                self.connect_google_sheet(capacity, reserved, confirmed, total)
        finally:
            self.root.after(0, self.finish_process)

    def finish_process(self):
        self.progress.stop()
        self.start_button.config(state=tk.NORMAL)
    
    def get_data(self, headless, username, password):
        self.log("Starting data extraction...")
        
        options = webdriver.EdgeOptions()
        options.use_chromium = True
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        if headless:
            options.add_argument("--headless")
        
        browser = webdriver.Edge(service=webdriver.EdgeService(EdgeChromiumDriverManager().install()), options=options)

        try:
            self.log("Direct to Login Page")
            browser.get('https://service.rsu.ac.th/GetIntranet/LoginAuthenPages.aspx')
            time.sleep(2)

            username_input = browser.find_element(By.ID, 'txtUsername')
            username_input.send_keys(username)

            password_input = browser.find_element(By.ID, 'txtPassword')
            password_input.send_keys(password)

            login_button = browser.find_element(By.ID, 'Button1')
            login_button.click()

            WebDriverWait(browser, 10).until(EC.url_to_be('https://service.rsu.ac.th/GetIntranet/Default.aspx'))

            desired_link = WebDriverWait(browser, 10).until(
                EC.presence_of_element_located((By.LINK_TEXT, 'จำนวนนักศึกษาที่ลงทะเบียนแยกตามรายวิชาที่เปิดสอน'))
            )
            desired_link.click()

            self.log("Redirect to student seat per subject page")
            
            WebDriverWait(browser, 10).until(EC.url_to_be('https://service.rsu.ac.th/GetIntranet/StudentSeatPerSubject.aspx'))

            academic_year_input = browser.find_element(By.ID, 'ContentPlaceHolder1_txtAcademicYear')
            academic_year_input.clear()
            academic_year_input.send_keys('2567')

            subject_codes = ['CPE432', 'CPE361', 'CPE308', 'CPE332', 'CPE326', 'IEN301']

            capacity_output, reserved_output, confirmed_output, total_output = [], [], [], []

            for subject_code in subject_codes:
                self.log(f"Searching for subject code: {subject_code}")
                subject_code_input = browser.find_element(By.ID, 'ContentPlaceHolder1_txtSubjCode')
                subject_code_input.clear()
                subject_code_input.send_keys(subject_code)

                submit_button = browser.find_element(By.ID, 'ContentPlaceHolder1_Button2')
                submit_button.click()

                try:
                    WebDriverWait(browser, 10).until(EC.presence_of_element_located((By.ID, 'ContentPlaceHolder1_GridView1')))
                except:
                    self.log(f"No data found for subject code: {subject_code}")
                    continue

                rows = browser.find_elements(By.XPATH, "//table[@id='ContentPlaceHolder1_GridView1']/tbody/tr[position()>1]")

                for row in rows:
                    columns = row.find_elements(By.TAG_NAME, 'td')
                    capacity_output.append(columns[2].text)
                    reserved_output.append(columns[3].text)
                    confirmed_output.append(columns[4].text)
                    total_output.append(columns[5].text)

                time.sleep(2)

            additional_subject_code = 'CPE327'
            self.log(f"Searching for additional subject code: {additional_subject_code}")

            subject_code_input = browser.find_element(By.ID, 'ContentPlaceHolder1_txtSubjCode')
            subject_code_input.clear()
            subject_code_input.send_keys(additional_subject_code)

            radio_button = browser.find_element(By.ID, 'ContentPlaceHolder1_RadioButtonList1_1')
            radio_button.click()

            submit_button = browser.find_element(By.ID, 'ContentPlaceHolder1_Button2')
            submit_button.click()

            try:
                WebDriverWait(browser, 10).until(EC.presence_of_element_located((By.ID, 'ContentPlaceHolder1_GridView2')))
            except:
                self.log(f"No data found for subject code: {additional_subject_code}")

            rows = browser.find_elements(By.XPATH, "//table[@id='ContentPlaceHolder1_GridView2']/tbody/tr[position()>1]")

            for row in rows:
                columns = row.find_elements(By.TAG_NAME, 'td')
                capacity_output.append(columns[2].text)
                reserved_output.append(columns[3].text)
                confirmed_output.append(columns[4].text)
                total_output.append(columns[5].text)

        finally:
            browser.quit()

        self.log("Data extraction complete.")
        self.log(f"Capacity: {capacity_output}")
        self.log(f"Reserved: {reserved_output}")
        self.log(f"Confirmed: {confirmed_output}")
        self.log(f"Total: {total_output}")

        return [capacity_output, reserved_output, confirmed_output, total_output]

    def connect_google_sheet(self, capacity, reserved, confirmed, total):
        scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
        credentials = Credentials.from_service_account_file("rsu-enroll-assistance-79177bd9b5df.json", scopes=scope)
        gc = gspread.authorize(credentials)
        spreadsheet_url = "https://docs.google.com/spreadsheets/d/1yleU7Z0U4QLq1cSqkzDsI3XwhYSSSuGnhNr70jLg5Aw/edit#gid=0"
        spreadsheet = gc.open_by_url(spreadsheet_url)
        worksheet = spreadsheet.sheet1

        if len(capacity) == len(reserved) == len(confirmed) == len(total):
            self.log("Start Writing to Google Sheet...")

            data = list(zip(reserved, confirmed, total))
            cell_list = worksheet.range('K2:M' + str(len(data) + 1))
            for i, value in enumerate(data):
                cell_list[i*3].value = value[0]
                cell_list[i*3 + 1].value = value[1]
                cell_list[i*3 + 2].value = value[2]
            
            worksheet.update_cells(cell_list)

            self.log("Writing to Google Sheet complete.")
        else:
            self.log("Data length mismatch among capacity, reserved, confirmed, and total")

if __name__ == "__main__":
    root = tk.Tk()
    app = EnrollmentApp(root)
    root.mainloop()