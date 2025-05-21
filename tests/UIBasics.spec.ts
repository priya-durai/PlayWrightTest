import { sign } from "crypto";

const {test,expect} =require('@playwright/test');

test('First PlayWright test',async ({browser,page})=>{
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

test('Dropdown check in login',async ({page})=>{
    const userName=page.locator("input#username");
    const termsCheckbox=page.locator("[id='terms']");
    //const password=page.locator("input[name='password']");
    //const signInButton=page.locator("#signInBtn");
    const roleDropdown=page.locator('select.form-control');
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    await roleDropdown.selectOption("teach");
    await page.locator('span.radiotextsty').last().click();
    await page.locator('#okayBtn').click();
    console.log(await page.locator('span.radiotextsty').last().isChecked());
    await expect(page.locator('span.radiotextsty').last()).toBeChecked();
    await termsCheckbox.click();
    await expect(termsCheckbox).toBeChecked();
    await termsCheckbox.uncheck();
    expect(await termsCheckbox.isChecked()).toBeFalsy();
    await expect(page.locator('body>a')).toHaveAttribute('class','blinkingText');
});


test('Child Window Handling',async ({browser})=>{
   const context=await browser.newContext();
   const page=await context.newPage();
   const documentLink=page.locator('body>a');
   await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
   const [newPage]=await Promise.all(
    [
        context.waitForEvent('page'),
        documentLink.click(),
    ]
   );
   let text=await newPage.locator('p.red').textContent();
   const array=text.split("@");
   text=array[1].split(" ")[0];
   console.log(text);
   await page.locator('input#username').fill(text);
   console.log(await page.locator('input#username').textContent());
});

test('Dynamic webe element selection',async ({page})=>{
    const productname="ZARA COAT 3";
    const products=page.locator(".card-body");
    const userEmail=page.locator('#userEmail');
    const password=page.locator("#userPassword");
    const automationBanner=page.locator(".logo-holder");
    await page.goto("https://rahulshettyacademy.com/client/auth/login");
    await userEmail.fill("anshika@gmail.com");
    await password.fill("Iamking@000");
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

test('Different locators test',async ({page})=>{
   await page.goto("https://rahulshettyacademy.com/angularpractice/");
   await page.getByLabel("Check me out if you Love IceCreams!").check();
   await page.getByPlaceholder("Password").fill("abcde");
   await page.getByRole('button',{name:'Submit'}).click();
   console.log(await page.getByText("Success! The Form has been submitted successfully!.").isVisible());
   await page.getByRole('link',{name:'Shop'}).click();
   await page.locator('app-card').filter({hasText: 'Nokia Edge'}).getByRole('button').click();
});

test.only('Calendar handling',async ({page})=>{
    const year=2024;
    const month=4;
    const date=16;
    const expectedDate:number[]=[month,date,year];
    const datePickerClass=page.locator("div.react-date-picker__inputGroup");
    const calendarNavigationButton=page.locator("button.react-calendar__navigation__label");
    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    await datePickerClass.click();
    await calendarNavigationButton.click();
    await calendarNavigationButton.click();
    await page.getByText(year).click();
    await page.locator('button.react-calendar__year-view__months__month').nth(month-1).click();
    await page.locator("//abbr[text()='"+date+"']").click();

    let dateElements=await page.locator("div.react-date-picker__inputGroup input");
    //console.log(await dateElements.getAttribute('value'));
    for(let index=0;index<dateElements.length;index++){
       const actualValue=dateElements[index].getAttribute('value'); 
       expect(actualValue).toEqual(expectedDate[index]);
    }
    //await page.pause();
});

test('Popup handling',async ({page})=>{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.goto("https://google.com");
    await page.goBack();
    await page.goForward();
    //check hidden element
    await expect(page.locator('#displayed-text')).toBeVisible();
    await page.locator('#hide-textbox').click();
    await expect(page.locator('#displayed-text')).toBeHidden();
    //check alerts
    page.on('dialog',dialog=>dialog.accept());
    await page.locator('#confirmbtn').click();

    //mouse hover
    await page.locator('#mousehover').hover();
    await page.locator('div.mouse-hover-content a').nth(0).click();
});

test('Iframe handler',async ({page})=>{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    const framePage=page.frameLocator('#courses-iframe');
    await framePage.locator("li a[href*='lifetime-access']:visible").click();
});

