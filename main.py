import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.microsoft import EdgeChromiumDriverManager
import time
import threading
import gspread
from google.oauth2.service_account import Credentials
import webbrowser

import requests

class EnrollmentApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Enrollment Assistance")
        self.root.geometry("800x680")
        self.stop_flag = threading.Event()
        self.create_widgets()
        self.subjects = []

    def create_widgets(self):
        self.style = ttk.Style()
        self.style.theme_use('clam')

        notebook = ttk.Notebook(self.root)
        notebook.pack(fill=tk.BOTH, expand=True)

        # First tab: Table
        self.table_frame = ttk.Frame(notebook, padding="10")
        notebook.add(self.table_frame, text="Search Results")

        self.table = ttk.Treeview(self.table_frame, columns=("รหัสวิชา", "ทฤษฎี", "รับได้", "จอง", "ยืนยัน", "รวม", "วันเรียน", "เวลาเรียน", "ห้องเรียน"), show="headings")
        for col in self.table["columns"]:
            self.table.heading(col, text=col)

        # Adjust column widths
        column_widths = {
            "รหัสวิชา": 80,
            "ทฤษฎี": 50,
            "รับได้": 50,
            "จอง": 50,
            "ยืนยัน": 50,
            "รวม": 50,
            "วันเรียน": 80,
            "เวลาเรียน": 80,
            "ห้องเรียน": 80
        }
        
        for col, width in column_widths.items():
            self.table.column(col, width=width)

        self.table.pack(fill=tk.BOTH, expand=True)

        # Default values to insert into the table
        default_values = [
            ('CPE432', 50, 0, 0, 0), ('CPE432', 50, 0, 0, 0),
            ('CPE361', 50, 0, 0, 0), ('CPE361', 50, 0, 0, 0),
            ('CPE308', 50, 0, 0, 0), ('CPE308', 50, 0, 0, 0),
            ('CPE332', 50, 0, 0, 0), ('CPE332', 50, 0, 0, 0),
            ('CPE326', 55, 0, 0, 0), ('CPE326', 55, 0, 0, 0),
            ('IEN301', 17, 0, 0, 0), ('IEN301', 17, 0, 0, 0),
            ('IEN301', 17, 0, 0, 0), ('IEN301', 17, 0, 0, 0),
            ('IEN301', 17, 0, 0, 0), ('IEN301', 17, 0, 0, 0),
        ]

        # Insert default values into the table
        for values in default_values:
            self.table.insert("", "end", values=(values[0], "ทฤษฎี", values[1], values[2], values[3], values[4], "วันเรียน", "เวลาเรียน", "ห้องเรียน"))

        # Second tab: CRUD
        self.todo_frame = ttk.Frame(notebook, padding="10")
        notebook.add(self.todo_frame, text="Subjects To-do List")

        self.todo_listbox = tk.Listbox(self.todo_frame, height=15)
        self.todo_listbox.pack(fill=tk.BOTH, expand=True, side=tk.LEFT, padx=5, pady=5)
        self.todo_listbox.bind("<Double-1>", self.edit_subject)

        self.todo_scrollbar = ttk.Scrollbar(self.todo_frame, orient=tk.VERTICAL, command=self.todo_listbox.yview)
        self.todo_scrollbar.pack(side=tk.LEFT, fill=tk.Y)
        self.todo_listbox.config(yscrollcommand=self.todo_scrollbar.set)

        button_frame = ttk.Frame(self.todo_frame)
        button_frame.pack(fill=tk.BOTH, expand=True, side=tk.RIGHT)

        self.add_button = ttk.Button(button_frame, text="+ Add Subject", command=self.add_subject)
        self.add_button.pack(padx=5, pady=5, fill=tk.X)

        self.delete_button = ttk.Button(button_frame, text="Delete Subject", command=self.delete_subject)
        self.delete_button.pack(padx=5, pady=5, fill=tk.X)

        # Third tab: Existing controls
        self.controls_frame = ttk.Frame(notebook, padding="10")
        notebook.add(self.controls_frame, text="Controls")

        input_frame = ttk.Frame(self.controls_frame)
        input_frame.pack(fill=tk.X, pady=(0, 20))

        ttk.Label(input_frame, text="Username:").grid(row=0, column=0, padx=(0, 10), sticky="e")
        self.username_var = tk.StringVar(value="u6505065")
        ttk.Entry(input_frame, textvariable=self.username_var).grid(row=0, column=1, sticky="ew")

        ttk.Label(input_frame, text="Password:").grid(row=1, column=0, padx=(0, 10), sticky="e")
        self.password_var = tk.StringVar(value=".Na592600")
        ttk.Entry(input_frame, textvariable=self.password_var, show="*").grid(row=1, column=1, sticky="ew")

        input_frame.columnconfigure(1, weight=1)

        control_frame = ttk.Frame(self.controls_frame)
        control_frame.pack(fill=tk.X, pady=(0, 20))

        self.start_button = ttk.Button(control_frame, text="Start", command=self.start_process)
        self.start_button.pack(side=tk.LEFT, padx=(0, 10))

        self.stop_button = ttk.Button(control_frame, text="Stop", command=self.stop_process, state=tk.DISABLED)
        self.stop_button.pack(side=tk.LEFT, padx=(0, 10))

        self.headless_var = tk.BooleanVar(value=True)
        self.headless_checkbox = ttk.Checkbutton(control_frame, text="Headless", variable=self.headless_var)
        self.headless_checkbox.pack(side=tk.LEFT)

        self.progress = ttk.Progressbar(self.controls_frame, orient=tk.HORIZONTAL, length=100, mode='indeterminate')
        self.progress.pack(fill=tk.X, pady=(0, 20))

        self.log_area = scrolledtext.ScrolledText(self.controls_frame, width=80, height=20)
        self.log_area.pack(fill=tk.BOTH, expand=True)

        footer_frame = ttk.Frame(self.controls_frame)
        footer_frame.pack(fill=tk.X, pady=(20, 0))

        url = "https://service.rsu.ac.th/GetIntranet/LoginAuthenPages.aspx"
        url_label = ttk.Label(footer_frame, text=url, foreground="blue", cursor="hand2")
        url_label.pack()
        url_label.bind("<Button-1>", lambda e: webbrowser.open_new(url))

        # Check website status
        self.status_label = ttk.Label(footer_frame, text="Status: Unknown", foreground="black")
        self.status_label.pack()

        self.check_website_status(url)

    def check_website_status(self, url):
        def check_status():
            try:
                response = requests.get(url)
                if response.status_code == 200:
                    self.status_label.config(text="Status: Online", foreground="green")
                else:
                    self.status_label.config(text="Status: Offline", foreground="red")
            except:
                self.status_label.config(text="Status: Offline", foreground="red")
        threading.Thread(target=check_status, daemon=True).start()

    def log(self, message):
        self.log_area.insert(tk.END, f"{time.strftime('%Y-%m-%d %H:%M:%S')} - {message}\n")
        self.log_area.see(tk.END)

    def start_process(self):
        self.log_area.delete(1.0, tk.END)
        self.start_button.config(state=tk.DISABLED)
        self.stop_button.config(state=tk.NORMAL)
        self.progress.start()
        self.stop_flag.clear()
        self.log("Process started")
        threading.Thread(target=self.run, daemon=True).start()

    def stop_process(self):
        self.log("Stopping process...")
        self.stop_flag.set()

    def run(self):
        try:
            headless = self.headless_var.get()
            username = self.username_var.get()
            password = self.password_var.get()
            self.log(f"Running with headless mode: {'On' if headless else 'Off'}")
            data = self.get_data(headless, username, password)
            if data and not self.stop_flag.is_set():
                self.update_table(data)
                capacity, reserved, confirmed, total = data

                # TODO
                # self.connect_google_sheet(capacity, reserved, confirmed, total)
                
        except Exception as e:
            self.log(f"An error occurred: {str(e)}")
        finally:
            self.root.after(0, self.finish_process)

    def finish_process(self):
        self.progress.stop()
        self.start_button.config(state=tk.NORMAL)
        self.stop_button.config(state=tk.DISABLED)
        self.log("Process finished")

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
            
            self.log("Navigating to login page...")
            browser.get('https://service.rsu.ac.th/GetIntranet/LoginAuthenPages.aspx')
            time.sleep(2)

            self.log("Entering login credentials...")
            username_input = browser.find_element(By.ID, 'txtUsername')
            username_input.send_keys(username)

            password_input = browser.find_element(By.ID, 'txtPassword')
            password_input.send_keys(password)

            login_button = browser.find_element(By.ID, 'Button1')
            login_button.click()

            self.log("Waiting for login to complete...")
            WebDriverWait(browser, 10).until(EC.url_to_be('https://service.rsu.ac.th/GetIntranet/Default.aspx'))

            self.log("Navigating to enrollment page...")
            desired_link = WebDriverWait(browser, 10).until(
                EC.presence_of_element_located((By.LINK_TEXT, 'จำนวนนักศึกษาที่ลงทะเบียนแยกตามรายวิชาที่เปิดสอน'))
            )
            desired_link.click()

            WebDriverWait(browser, 10).until(EC.url_to_be('https://service.rsu.ac.th/GetIntranet/StudentSeatPerSubject.aspx'))

            self.log("Setting academic year...")
            academic_year_input = browser.find_element(By.ID, 'ContentPlaceHolder1_txtAcademicYear')
            academic_year_input.clear()
            academic_year_input.send_keys('2567')

            subject_codes = ['CPE432', 'CPE361', 'CPE308', 'CPE332', 'CPE326', 'IEN301']

            capacity_output, reserved_output, confirmed_output, total_output = [], [], [], []

            for subject_code in subject_codes:
                if self.stop_flag.is_set():
                    self.log("Process stopped by user")
                    return None

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
        
        '''
            self.log(f"Capacity: {capacity_output}")
            self.log(f"Reserved: {reserved_output}")
            self.log(f"Confirmed: {confirmed_output}")
            self.log(f"Total: {total_output}")
        '''

        # Simulated test data
        # capacity_output = ['50', '50', '50', '50', '50', '50', '55', '55', '17', '17', '17', '17', '17', '17']
        # reserved_output = ['0', '0', '0', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
        # confirmed_output = ['0', '0', '49', '0', '2', '0', '0', '55', '0', '0', '20', '0', '0', '0']
        # total_output = ['0', '0', '0', '0', '0', '0', '3', '0', '0', '0', '0', '0', '0', '0']

        return [capacity_output, reserved_output, confirmed_output, total_output]
    
    def update_table(self, data):
        capacity, reserved, confirmed, total = data
        self.table.delete(*self.table.get_children())

        subject_codes = ['CPE432', 'CPE361', 'CPE308', 'CPE332', 'CPE326', 'IEN301']
        subjects_mapping = {
            'CPE432': 2,
            'CPE361': 2,
            'CPE308': 2,
            'CPE332': 2,
            'CPE326': 2,
            'IEN301': 6
        }

        # Define tags for background colors
        self.table.tag_configure('yellow_bg', background='yellow')
        self.table.tag_configure('red_bg', background='red')

        index = 0
        for subject_code in subject_codes:
            for _ in range(subjects_mapping[subject_code]):
                if index < len(capacity):
                    confirmed_int = int(confirmed[index])
                    capacity_int = int(capacity[index])
                    total_int = int(total[index])

                    # Determine the tag based on the confirmed value
                    tag = ''
                    if confirmed_int == capacity_int:
                        tag = 'red_bg'
                    elif confirmed_int >= capacity_int * 0.8:
                        tag = 'yellow_bg'

                    # Insert the row with the tag applied only to the "total" column
                    row_values = (subject_code, "ทฤษฎี", capacity[index], reserved[index], confirmed[index], total[index], "วันเรียน", "เวลาเรียน", "ห้องเรียน")
                    tags = ('', '', '', '', '', tag, '', '', '')
                    self.table.insert("", "end", values=row_values, tags=tags)
                    index += 1

            # Add a blank row for underline effect
            self.table.insert("", "end", values=("", "", "", "", "", "", "", "", ""), tags=())
    '''
    def connect_google_sheet(self, capacity, reserved, confirmed, total):
        self.log("Connecting to Google Sheet...")
        scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
        credentials = Credentials.from_service_account_file("rsu-enroll-assistance-79177bd9b5df.json", scopes=scope)
        gc = gspread.authorize(credentials)
        spreadsheet_url = "https://docs.google.com/spreadsheets/d/1yleU7Z0U4QLq1cSqkzDsI3XwhYSSSuGnhNr70jLg5Aw/edit#gid=0"
        spreadsheet = gc.open_by_url(spreadsheet_url)
        worksheet = spreadsheet.sheet1

        if len(capacity) == len(reserved) == len(confirmed) == len(total):
            self.log("Start writing to Google Sheet...")

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
    '''

    def add_subject(self):
        new_subject = "New Subject"
        self.subjects.append(new_subject)
        self.todo_listbox.insert(tk.END, new_subject)

    def delete_subject(self):
        selected_index = self.todo_listbox.curselection()
        if selected_index:
            self.todo_listbox.delete(selected_index)
            del self.subjects[selected_index[0]]
        else:
            messagebox.showwarning("Delete Subject", "Please select a subject to delete.")

    def edit_subject(self, event):
        selected_index = self.todo_listbox.curselection()
        if selected_index:
            new_name = tk.simpledialog.askstring("Edit Subject", "Enter new subject name:")
            if new_name:
                self.subjects[selected_index[0]] = new_name
                self.todo_listbox.delete(selected_index)
                self.todo_listbox.insert(selected_index, new_name)
        else:
            messagebox.showwarning("Edit Subject", "Please select a subject to edit.")

if __name__ == "__main__":
    root = tk.Tk()
    app = EnrollmentApp(root)
    root.mainloop()
