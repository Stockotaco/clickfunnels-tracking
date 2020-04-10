    var pagePath = document.location.pathname.replace(/\/?(\?|#|$)/, '/$1')  
    var pageHostname = document.location.hostname
    function flEvent(event, data, sendToDl) {
      var eventData = data || {};
      // console.log(`the dataType is ${typeof(data)}`)
      if (typeof(data) === 'object') {
          let dlEvent = function() {
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                  'event': `fl-${event}`,
                  eventData,
              })
              console.log(`fl-${event} dataLayer event sent`)
          }
          if (!sendToDl) { // if the third function argument is falsy (empty), trigger the dataLayer event by default
              dlEvent()
          }
          try {
              window.funnelytics.events.trigger(
                event,
                eventData,
              );
            } catch (error) {
              console.error(error);
              var checker = window.setInterval(function () {
                if (!window.funnelytics) {
                  console.log('searching for window.funnelytics')
                  return;
                }
                if (!window.funnelytics.step) {
                    
                  console.log('searching for window.funnelytics.step')
                  return;
                }
                window.funnelytics.events.trigger(
                  event,
                  eventData,
                );
                window.clearInterval(checker);
              }, 200);
            }
          } else {
      console.log(`flEvent dataType is expecting an object. Instead it's a(n) ${typeof(data)}`)
  }
  }
  if (typeof pageType === "undefined") {
    console.error('You need to declare a pageType in the page settings to track Funnelytics on Click Funnels pages.')
}
  switch (pageType) {
      case 'single-step':
        console.log('Is a single step form')
        $(function() {   
            $('#cfAR').on('submit', function() {
              //check for all fields with the name selector 'name'. Store them in an array and then add them to a string.
              arrFormNameFieldValues =[]
              $('[name*="name"]:visible').each(function () {
              let formNameFieldName = $(this).attr('name')
              let formNameFieldValue = $(this).val()
              //console.log(`${formNameFieldName} has a value of ${formNameFieldValue}`)
              if (formNameFieldValue) {
              window.arrFormNameFieldValues.push(formNameFieldValue)
              }
              })
                var mainName = $('.product-name').eq(0).text();
                var bumpName = $('.product-name').eq(1).text();
                var mainPrice = $('.product-price').eq(0).text().split('').filter(letter => {return letter.match(/[0-9\.]/i);}).join('');
                var bumpPrice = $('.product-price').eq(1).text().split('').filter(letter => {return letter.match(/[0-9\.]/i);}).join('');
                var totalOrderValue = parseFloat(mainPrice || 0) + parseFloat(bumpPrice || 0);
                var visitorName = arrFormNameFieldValues.toString().replace(/,/g," ")
                var visitorEmail = $('[name*="email"]').val();
                console.log('Purchase was made'); 
                //If Bump Was Taken Trigger actions
                    if ($('.product-name').length !==1) {
                    //Trigger Funnelytics Actions for Main and Bump
                    //main product
                        flEvent("purchase", {
                            mainProductName: mainName,
                            mainProductPrice: mainPrice,
                            name: visitorName,
                            email: visitorEmail,
                            orderTotal: totalOrderValue,
                            purchaseBump: 'true',
                        })
                    //bump product
                        flEvent("purchase", 
                            {bumpProductName: bumpName,
                            bumpProductPrice: bumpPrice,}
                        );
                    } else {
                    //If bump was not taken, trigger Funnelytics Action for Main Only
                        flEvent("purchase", {
                            mainProductName: mainName,
                            mainProductPrice: mainPrice,
                            name: visitorName,
                            email: visitorEmail,
                            orderTotal: totalOrderValue,
                            purchaseBump: 'false'}
                        )
                    }
                    } 
                )     
            });
            break;
      case 'multi-step':
        console.log('Is a multi-step form')
        jQuery(function($){      
            $('[href="#submit-form-2step"]').on('click', function() { 
             formValValidation = []
             $('.required1').each(function() {
               var visitorInfo = $(this).val()
               var formFieldName = $(this).attr('name')
               if (visitorInfo !== "" || undefined) {
                 //console.log(formFieldName + ' has a value')
                 window.formValValidation.push('true')
               } else {
                   if (formFieldName == undefined) {
                     //console.log(formFieldName + ' has an element name that is not defined and wont count against validation')
                     window.formValValidation.push('na')
                   } else {
                     //console.log(formFieldName + ' Does not have a value')
                     window.formValValidation.push('false')
                   }
               }
             })
             jQuery(function($){
               var validFormArray = $.inArray('false', formValValidation)
             if (validFormArray != -1) { 
                console.log('do not trigger event.')
             } else {
                console.log('okay to trigger event.')
                arrNameFieldValues = []
                arrFormNameFieldValues =[]
                $('[name*="name"]:visible').each(function () {
                let formNameFieldName = $(this).attr('name')
                let formNameFieldValue = $(this).val()
                //console.log(`${formNameFieldName} has a value of ${formNameFieldValue}`)
                if (formNameFieldValue) {
                window.arrFormNameFieldValues.push(formNameFieldValue)
                }
                })
                var visitorName = arrFormNameFieldValues.toString().replace(/,/g," ")
                var visitorEmail = $('[name*="email"]').val();
               flEvent("form-submit", {
                   name: visitorName,
                   email: visitorEmail,
                   formPath: pagePath,
                   formStep: 1
               })
             }
           })
            })
            $('#cfAR').on('submit', function() {
             var mainName = $('.product-name').eq(0).text();
             var bumpName = $('.product-name').eq(1).text();
             var mainPrice = $('.product-price').eq(0).text().split('').filter(letter => {return letter.match(/[0-9\.]/i);}).join('');
             var bumpPrice = $('.product-price').eq(1).text().split('').filter(letter => {return letter.match(/[0-9\.]/i);}).join('');
             var totalOrderValue = parseFloat(mainPrice || 0) + parseFloat(bumpPrice || 0);
             console.log('Purchase Was Made');
             //If Bump Was Taken Save Variables and Trigger actions
                 if ($('.product-name').length !==1) {
                 //Trigger Funnelytics Actions for Main and Bump
                 console.log('Main + Bump Products Were Purchased')
                 //main product
                     flEvent("purchase", {
                         mainProductName: mainName,
                         mainProductPrice: mainPrice,
                         orderTotal: totalOrderValue,
                         purchaseBump: 'true',
                     }, function() {
                         // continue with process..
                     });
                 //bump product
                     flEvent("purchase", {
                         bumpProductName: bumpName,
                         bumpProductPrice: bumpPrice,
                     }, function() {
                         // continue with process..
                     });
                 } else {
                 //Trigger Funnelytics Action for Main Only
                 console.log('Main Product Only Was Purchased')
                     flEvent("purchase", {
                         mainProductName: mainName,
                         mainProductPrice: mainPrice,
                         orderTotal: totalOrderValue,
                         purchaseBump: 'false'
                     }, function() {
                         // continue with process..
                     });
                 }
             })   
         });
        break;
      case 'addon':
        console.log('Is an upsell or downsell - single purchase only')
        jQuery(function($){
            $('a[href*="#yes"]').on('click',function() {
                var dataPurchase = $(this).attr('data-purchase')
                var dataPurchaseDecoded = JSON.parse(dataPurchase)
                // console.log(dataPurchase)
                var productId = dataPurchaseDecoded.product_id
                console.log(productId)
                    //Trigger Funnelytics Action For Purchase
                    flEvent("purchase", {
                        productId: productId,
                        product: 'addon',
                        pagePath: pagePath,
                    }, function() {
                        // continue with process..
                    })
            })
                $('a[href*="#no"]').on('click',function() {
                    console.log('Addon Product was Rejected')
                    // get productId from href
                    //Trigger Funnelytics Action For Not Purchasing
                      flEvent("reject-click", {
                          pagePath: pagePath,
                          product: "addon"
                      }, function() {
                          // continue with process..
                      })
                })
            });
        break;
        case 'addon-multiple':
        console.log('Is an upsell or downsell - 3 or more products')
        jQuery(function($){
          $('a[href*="#yes"]').on('click',function() {
              var prodAddonArr = $('[data-title*="bump-button"]:visible')
              for (var i = 0; i < prodAddonArr.length; i++) {
              if (prodAddonArr[i].innerText.trim().toLowerCase() == "added"){            
                  console.log(i+1 + " " + "Product(s) Added")
                  var dataPurchase = $(this).attr('data-purchase')
                  var dataPurchaseDecoded = JSON.parse(dataPurchase)
                  console.log(dataPurchase)
                  var prodId = dataPurchaseDecoded.product_id
                  console.log(prodId)
                  //Trigger Funnelytics Action For Purchase(s)
                  window.funnelytics.events.trigger("purchase", {
                      pagePath: pagePath,
                      addonNumber: i+1,
                  }, function() {
                      // continue with process..
                  })
                      }
              }
          })
          $('a[href*="#no"]').on('click',function() {
              console.log('Addon Product was Rejected')
              //Trigger Funnelytics Action For Not Purchasing
              window.funnelytics.events.trigger("reject-click", {
                  pagePath: pagePath,
                  product: "addon"
              }, function() {
                  // continue with process..
              })
          })
      });
        break;
      case 'optin':
        console.log('Is an optin page')
        $('#cfAR').on('submit', function() {
            formValValidation = []
            $('.required1').each(function() {
              var visitorInfo = $(this).val()
              var formFieldName = $(this).attr('name')
              if (visitorInfo !== "" || undefined) {
                //console.log(formFieldName + ' has a value')
                window.formValValidation.push('true')
              } else {
                  if (formFieldName == undefined) {
                    //console.log(formFieldName + ' has an element name that is not defined and wont count against validation')
                    window.formValValidation.push('na')
                  } else {
                    //console.log(formFieldName + ' Does not have a value')
                    window.formValValidation.push('false')
                  }
              }
            })
            jQuery(function($){
              var validFormArray = $.inArray('false', formValValidation)
            if (validFormArray != -1) { 
               console.log('do not trigger event.')
            } else {
               console.log('okay to trigger event.')
               //check for all fields with the name selector 'name'. Store them in an array and then add them to a string.
              arrFormNameFieldValues =[]
              $('[name*="name"]:visible').each(function () {
              let formNameFieldName = $(this).attr('name')
              let formNameFieldValue = $(this).val()
              //console.log(`${formNameFieldName} has a value of ${formNameFieldValue}`)
              if (formNameFieldValue) {
              window.arrFormNameFieldValues.push(formNameFieldValue)
              }
              })
              var visitorName = arrFormNameFieldValues.toString().replace(/,/g," ")
              var visitorEmail = $('[name*="email"]').val();
                flEvent("form-submit",{
                    name: visitorName,
                    email: visitorEmail,
                    formTitle: formTitle,
                  })
            }
          })
          })
        break;
      default:
        console.log(`pageType "${pageType}" is not recognized.`)
  }