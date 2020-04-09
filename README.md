# clickfunnels-tracking
Scripts to track clickfunnels

Every page needs to have a pageType declared. 
Optin pages need to have a formTitle declared as well.
Page Types:
let pageType = "single-step"
let pageType = "multi-step"
let pageType = "optin"
let pageType = "addonProduct-single"
let pageType = "addonProduct-multiple"

single-step represents an order form page where the user inputs all the required fields in a single form.
    The way to define these in a Funnelytics advanced action is by specifying purchasBump as either true or false.

multi-step represents an order form page where the user inputs their contact details on one form but their 
    billing details on a different form. Both forms are on the same page though.
    In Funnelytics you can have 1 action that represent the optin on the first step, 
        and another action that represents the purchase of the main product with/without the bump.
    The way to define these in a Funnelytics advanced action is by specifying the productId.

optin represents a page where the user submits a form but no payment or checkout information is taken. 
    The way to define these in a Funnelytics advanced action is by adding the formTitle that you declared earlier.

addonProduct-single represents a page that is either an upsell or downsell and only 1 product can be purchased. 
    There can be 2 different products on the page but they cannot be purchased simultaneously. It's either one or the other. 
    The way to define these in a Funnelytics advanced action is by specifying the productId.

addonProduct-multiple represents a page that is either an upsell or downsell and multiple products can be purchased simultaneously.
    The way to define these in a Funnelytics advanced action is by specifying the productId.

By Default, Funnelytics events using the flEvent function (which are being used in this script) will also be sent to the Google Tag Manager dataLayer.
    To disable this, you will need to add a third argument to the flEvent call with the value of 1.
    Example: flEvent('event name', {data}, 1)
    Adding a 1 will NOT add the event to the dataLayer.
    Do you need to disable this? Likely no, even if you're not using GTM, it won't cause conflicts.
    To access the event data in GTM, create a dataLayer variable using dot notation. 
    Example: eventData.productId would make the product Id available as a variable. This variable can then be used in other tags.
    It's also important to note that the value of the second argument, {data}, needs to be an object.