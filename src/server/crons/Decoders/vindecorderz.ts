import { Builder } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";
import { load } from "cheerio";
import ScrapedVehicle from "~/server/models/ScrapedVehicle"

export const getVinsNoFromVinDecoderz = async () => {
    try {
        let shouldContinue = true;
        const chromeOptions = new Options();
        let retries = 0;
        chromeOptions.addArguments("--headless"); // Run in headless mode
        chromeOptions.addArguments("--no-sandbox");
        chromeOptions.addArguments("--disable-dev-shm-usage"); // Overcome limited resource problems

        while (shouldContinue) {
            const driver = new Builder()
                .forBrowser("chrome")
                .setChromeOptions(chromeOptions)
                .build();
            await driver.get("https://www.vindecoderz.com/EN/Acura");
            const pageSource = await driver.getPageSource();
            const $ = load(pageSource);

            const listItems = $(".list-group-item");
            const vins: string[] = [];
            listItems.each((index, element) => {
                const vin = $(element).find("a").text().trim();
                vins.push(vin);
            });

            // add vins to the database 
            // vin column is unique in the database
            const allDuplicates = [];
            for (const vin of vins) {
                try {
                    const req = await ScrapedVehicle.findOrCreate({
                        where: { vin },
                        defaults: {
                            vin,
                        },
                    });

                    // check if req is created or found
                    if (req[1]) {
                        console.log(`Created new record for VIN: ${vin}`);
                    } else {
                        allDuplicates.push(vin);
                        console.log(`Found duplicate VIN: ${vin}`);
                    }
                } catch (error) {
                    shouldContinue = false; // Replace with your actual condition
                }
            }

            await driver.quit(); // Close the browser after processing the page

            if (allDuplicates.length === vins.length) {
                console.log("All VINs are duplicates, stopping the process.");
                retries += 1;
                if (retries >= 10) {
                    shouldContinue = false;
                }
            }

            const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
            await sleep(10000); // Sleep for 2 seconds before the next iteration
        }

    } catch (error: any) {
        console.error("Error fetching data:", error.message);
    }
}

