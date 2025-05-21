const {test}=require('@playwright/test');

let webContext;

test.beforeAll(async ({browser})=>{

    const context=await browser.newContext();
    const page=await context.newPage();
    const userEmail=await page.locator('#userEmail');
    const password=await page.locator("#userPassword");
    const signInButton=await page.locator("#signInBtn");
   await page.goto("https://rahulshettyacademy.com/client");
    await userEmail.fill("anshika@gmail.com");
    await password.fill("Iamking@000");
    await page.locator("input#login").click();
    await page.waitForLoadState('networkidle');
    await context.storageState({path:'state.json'});
    webContext=await browser.newContext({storageState:'/Users/Priya/IdeaProjects/PlayWright/PlayWrightTest/state.json'});
});

//test.use({storageState:'/Users/Priya/IdeaProjects/PlayWright/PlayWrightTest/state.json'});

test('Dynamic webe element selection',async ({browser})=>{
    const productname="ZARA COAT 3";
    //webContext=await browser.newContext({storageState:'/Users/Priya/IdeaProjects/PlayWright/PlayWrightTest/state.json'});
    const page=await webContext.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    const products=page.locator(".card-body");
    const automationBanner=page.locator(".logo-holder");
    //await page.goto("https://rahulshettyacademy.com/client/auth/login");
    await automationBanner.waitFor();
    const titles=await page.locator(".card-body b").allTextContents();
    console.log(titles);
    const count=products.count();
    console.log(count);
    for(let i=0;i<count;i++){
        const text=await products.nth(i).locator('b').textContent();
        if(text.equals(productname)){
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }
});


