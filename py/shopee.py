from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

# Set up WebDriver using ChromeDriverManager
driver = webdriver.Chrome()

# Define the URL of the product
# url = 'https://shopee.co.th/Pop-MART-THE-MONSTERS-%E0%B8%81%E0%B8%A5%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%AA%E0%B8%B8%E0%B9%88%E0%B8%A1%E0%B9%84%E0%B8%A7%E0%B8%99%E0%B8%B4%E0%B8%A5-%E0%B8%AA%E0%B8%B5%E0%B8%A1%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B9%81%E0%B8%AA%E0%B8%99%E0%B8%AD%E0%B8%A3%E0%B9%88%E0%B8%AD%E0%B8%A2-i.569947420.20394658477?sp_atk=1715bffe-b97c-4ee2-8c4c-07469b491553&xptdk=1715bffe-b97c-4ee2-8c4c-07469b491553'
url = 'https://shopee.co.th/-%E0%B9%81%E0%B8%9E%E0%B9%87%E0%B8%84%E0%B8%84%E0%B8%B9%E0%B9%88-Pantene-%E0%B9%81%E0%B8%9E%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B8%99-%E0%B9%81%E0%B8%8A%E0%B8%A1%E0%B8%9E%E0%B8%B9-%E0%B9%82%E0%B8%9B%E0%B8%A3-%E0%B8%A7%E0%B8%B5-Pro-V-Shampoo-1.2L-x2-%E0%B8%82%E0%B8%A7%E0%B8%94-%E0%B8%9C%E0%B8%A5%E0%B8%B4%E0%B8%95%E0%B8%A0%E0%B8%B1%E0%B8%93%E0%B8%91%E0%B9%8C%E0%B8%94%E0%B8%B9%E0%B9%81%E0%B8%A5%E0%B8%9C%E0%B8%A1-%E0%B8%9A%E0%B8%B3%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B8%9C%E0%B8%A1-%E0%B8%AD%E0%B8%A2%E0%B8%B9%E0%B9%88%E0%B8%A3%E0%B8%B0%E0%B8%AB%E0%B8%A7%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B9%80%E0%B8%9B%E0%B8%A5%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%99%E0%B8%9A%E0%B8%A3%E0%B8%A3%E0%B8%88%E0%B8%B8%E0%B8%A0%E0%B8%B1%E0%B8%93%E0%B8%91%E0%B9%8C-i.78382981.11054128666'
# Open the product page
driver.get(url)

try:
    # Wait for the selection box to be clickable and click it
    selection_box = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CLASS_NAME, "selection-box-selected"))
    )
    selection_box.click()

    # Wait for the "ซื้อสินค้า" button to be clickable and click it
    buy_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'btn-solid-primary') and contains(@class, 'btn--l') and contains(text(), 'ซื้อสินค้า')]"))
    )
    buy_button.click()

    # Add any additional steps here, such as logging in, confirming purchase, etc.

except Exception as e:
    print(f"An error occurred: {e}")

finally:
    # Close the driver after a delay to observe the result (optional)
    time.sleep(5)
    driver.quit()
