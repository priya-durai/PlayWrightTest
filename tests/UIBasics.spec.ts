import { sign } from "crypto";

const {test,expect} =require('@playwright/test');

test.only('First PlayWright test',async ({browser,page})=>{
    //  const context=await browser.newContext();
    //  const page=await context.newPage();
    const userName=page.locator("input#username");
    const password=page.locator("input[name='password']");
    const signInButton=page.locator("#signInBtn");
    const cardTitle=page.locator(".card-body a");
     await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
     console.log(await page.title());
     await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");
     await userName.fill("rahulshetty");
     await password.fill("learning");
     //await page.locator("[id='terms']").click();
     await signInButton.click();
     console.log(await page.locator("[style*='block']").textContent());
     await userName.fill("");
     await userName.fill("rahulshettyacademy");
     await signInButton.click();
     //await page.waitForLoadState('networkidle');
     await page.locator('.card-body').first().waitFor();
     //console.log(await cardTitle.first().textContent());
    //  console.log(await cardTitle.nth(1).textContent());
    //  console.log(await cardTitle.last().textContent());
     const allCardTitles=await cardTitle.allTextContents();
     console.log(allCardTitles);
});