const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer((req, res) => {
    const filePath = __dirname + "/.." + req.url;
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "File not found" }));
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  });

  const PORT = process.env.PORT || 3000;
  await new Promise((resolve) => server.listen(PORT, resolve));
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe("heading 2", () => {
  it("should exist", async () => {
    const heading = await page.$("h2");
    expect(heading).not.toBeNull();
  });
});

describe("span", () => {
  it("should exist", async () => {
    const span = await page.$("span");
    expect(span).not.toBeNull();
  });
});

describe("div", () => {
  it("should exist", async () => {
    const div = await page.$("div");
    expect(div).not.toBeNull();
  });
});

describe("image", () => {
  it("should exist with valid attributes", async () => {
    const img = await page.$("img");
    expect(img).not.toBeNull();

    const src = await page.$eval("img", (img) => img.getAttribute("src"));
    expect(src).not.toBeNull();

    const alt = await page.$eval("img", (img) => img.getAttribute("alt"));
    expect(alt).not.toBeNull();
  });
});
