# Click Funnels Tracking
Scripts to track Click Funnels pages in Funnelytics

## Click Funnels Setup Instructions

### Get your base script from project settings

Each project has it's own script in "Project Settings"
![Where to Find the Funnelytics Base Script](https://p91.p3.n0.cdn.getcloudapp.com/items/8LujGov5/2020-04-10_12-41-49.png?v=844550786a70009f3b7d2000cc26269f)

The script will look like this: 

```
<script type="text/javascript"> (function(funnel) { var insert = document.getElementsByTagName('script')[0], script = document.createElement('script'); script.addEventListener('load', function() { window.funnelytics.init(funnel, false); }); script.src = 'https://cdn.funnelytics.io/track.js'; script.type = 'text/javascript'; script.async = true; insert.parentNode.insertBefore(script, insert); })('YOUR PROJECT ID'); </script>
```

Just be sure to replace `YOUR PROJECT ID` with your actual project ID.

### Install the base script into the global `BODY TRACKING CODE` field

Each funnel has global settings that will be applied to every step in the funnel. Adding the script to this one field will add it to every step.

![Where to install the base script](https://p91.p3.n0.cdn.getcloudapp.com/items/QwuKWA11/2020-04-10_12-37-40.png?v=0d0d8086eb9eba1d6282fdab94476b68)

In addition to the base script, add the contents of the master_script.js to the body tracking code.

You can use this script to call the repository with a CDN jsDelivr. 

```
<script src="https://cdn.jsdelivr.net/gh/Stockotaco/clickfunnels-tracking@v1.0.0/master_script.min.js"></script>
```

### Declare a `pageType` on each step of the funnel in the `head`

![Declare variables on each page individually](https://p91.p3.n0.cdn.getcloudapp.com/items/7Ku0BEwd/2020-04-10_12-59-40.png?v=fba0089a11047246fd8292c8c78d9d84)

Every page needs to have a `pageType` declared. 

Optin pages need to have a `formTitle` declared as well.

Declare the page type on each corresponding page:

```
<script>
let pageType = "single-step"
</script>
```
```
<script>
let pageType = "multi-step"
</script>
```

```
<script>
let pageType = "addon"
</script>
```
```
<script>
let pageType = "addon-multiple"
</script>
```
On an optin page, decalare the `pageType` and `formTitle`

```
<script>
let pageType = "optin"
let formTitle = "YOUR FORM TITLE"
</script>
```

`single-step` represents an order form page where the user inputs all the required fields in a single form.
    The way to define these in a Funnelytics advanced action is by specifying purchasBump as either true or false.

`multi-step` represents an order form page where the user inputs their contact details on one form but their 
    billing details on a different form. Both forms are on the same page though.
    In Funnelytics you can have 1 action that represent the optin on the first step, 
        and another action that represents the purchase of the main product with/without the bump.


`optin` represents a page where the user submits a form but no payment or checkout information is taken. 
    The way to define these in a Funnelytics advanced action is by adding the formTitle that you declared earlier.

`addon` represents a page that is either an upsell or downsell and only 1 product can be purchased. 
    There can be 2 different products on the page but they cannot be purchased simultaneously. It's either one or the other. 


`addonProduct-multiple` represents a page that is either an upsell or downsell and multiple products can be purchased simultaneously. This is not common.
    The way to define these in a Funnelytics advanced action is by specifying the productId.


## Funnelytics Setup Instructions

### Map all the steps out onto the canvas

Here's an example of a funnel that has:

1. A multi-step order form
2. 2 one-time offer (OTO) pages
3. 2 Downsell offers

![Example Funnel In Funnelytics](https://p91.p3.n0.cdn.getcloudapp.com/items/eDu62gLA/Image%202020-04-10%20at%201.09.28%20PM.png?v=2471b30d1a8c1d432fab3dcab68241c3)

Refer to this document on how to configure each setting individually in Funnelytics:

https://docs.google.com/spreadsheets/d/1VKRQ3Af18hlml-urb84tFj8FewuERlQqzOtgutvyxBI/edit?usp=sharing