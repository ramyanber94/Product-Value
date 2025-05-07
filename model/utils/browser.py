import os
import re
import platform
import subprocess
from webbrowser import Chrome
import zipfile
import requests
import undetected_chromedriver as uc
from selenium.common.exceptions import WebDriverException


class ChromeDriverManager:
    _driver = None  # Class-level shared browser instance

    @staticmethod
    def open_browser():
        if ChromeDriverManager._driver is not None:
            return ChromeDriverManager._driver  # Reuse existing

        manager = ChromeDriverManager()
        driver_executable = manager._ensure_chromedriver()
        ChromeDriverManager._driver = uc.Chrome(
            driver_executable_path=driver_executable)
        return ChromeDriverManager._driver

    def __init__(self):
        self.platform_name = self._get_os_platform()
        self.chrome_version = self._get_chrome_version()
        self.driver_path = self._get_driver_path()

    def _get_os_platform(self):
        system = platform.system()
        if system == 'Windows':
            return 'win64'
        elif system == 'Linux':
            return 'linux64'
        else:
            raise Exception("Unsupported OS")

    def _get_chrome_version(self):
        try:
            system = platform.system()
            if system == "Windows":
                command = r'reg query "HKEY_CURRENT_USER\Software\Google\Chrome\BLBeacon" /v version'
                output = subprocess.check_output(command, shell=True).decode()
                version = re.search(
                    r"version\s+REG_SZ\s+([^\s]+)", output).group(1)
            elif system == "Linux":
                output = subprocess.check_output(
                    ["google-chrome", "--version"]).decode()
                version = re.search(r"(\d+\.\d+\.\d+\.\d+)", output).group(1)
            else:
                raise Exception("Unsupported OS")
            return version
        except Exception as e:
            raise Exception(f"Error getting Chrome version: {e}")

    def _get_driver_path(self):
        folder = f"chromedriver-{self.platform_name}"
        driver = os.path.join(folder, "chromedriver")
        if platform.system() == "Windows":
            driver += ".exe"
        return os.path.abspath(driver)

    def _get_local_chromedriver_version(self):
        try:
            output = subprocess.check_output(
                [self.driver_path, '--version']).decode()
            match = re.search(r'ChromeDriver\s+(\d+\.\d+\.\d+\.\d+)', output)
            if match:
                return match.group(1)
        except Exception:
            return None
        return None

    def _ensure_chromedriver(self):
        zip_name = f"chromedriver-{self.platform_name}.zip"

        if os.path.exists(self.driver_path):
            local_version = self._get_local_chromedriver_version()
            if local_version == self.chrome_version:
                print(f"✅ Local ChromeDriver is up-to-date: {local_version}")
                return self.driver_path
            else:
                print(
                    f"⚠️ ChromeDriver version mismatch: {local_version} != {self.chrome_version}")
                try:
                    os.remove(self.driver_path)
                except Exception as e:
                    raise Exception(f"Failed to remove old ChromeDriver: {e}")

        # Download ChromeDriver
        url = f"https://storage.googleapis.com/chrome-for-testing-public/{self.chrome_version}/{self.platform_name}/chromedriver-{self.platform_name}.zip"
        response = requests.get(url, stream=True)
        if response.status_code != 200:
            raise Exception(
                f"Failed to download ChromeDriver: HTTP {response.status_code}")
        with open(zip_name, 'wb') as f:
            for chunk in response.iter_content(1024):
                if chunk:
                    f.write(chunk)
        with zipfile.ZipFile(zip_name, 'r') as zip_ref:
            zip_ref.extractall(".")
        os.remove(zip_name)
        print("✅ ChromeDriver downloaded and extracted.")
        return self.driver_path

    def is_browser_alive(self, driver: Chrome) -> bool:
        try:
            driver.title  # simple no-op request
            return True
        except WebDriverException:
            return False
