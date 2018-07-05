import * as puppeteer from "puppeteer";
import { BrowserTab } from ".";

export class Browser {
  private browser: puppeteer.Browser;

  public constructor(browser: puppeteer.Browser) {
    this.browser = browser;
  }

  public static async launch(): Promise<Browser> {
    const browser = await puppeteer.launch({
      headless: true,
      devtools: false
    });
    return new Browser(browser);
  }

  public async newTab(baseUrl: string): Promise<BrowserTab> {
    const page = await this.browser.newPage();
    return new BrowserTab(page, baseUrl);
  }

  public async close(): Promise<void> {
    await this.browser.close();
  }
}
