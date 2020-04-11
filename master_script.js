const pagePath = document.location.pathname.replace(/\/?(\?|#|$)/, '/$1');
const pageHostname = document.location.hostname;

function flEvent(event, data, sendToDl) {
  const eventData = data || {};
  // console.log(`the dataType is ${typeof(data)}`)
  if (typeof data === 'object') {
    const dlEvent = function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: `fl-${event}`,
        eventData,
      });
      console.log(`fl-${event} dataLayer event sent`);
    };
    if (!sendToDl) {
      // if the third function argument is falsy (empty), trigger the dataLayer event by default
      dlEvent();
    }
    try {
      window.funnelytics.events.trigger(event, eventData);
    } catch (error) {
      console.error(error);
      const checker = window.setInterval(function () {
        if (!window.funnelytics) {
          console.log('searching for window.funnelytics');
          return;
        }
        if (!window.funnelytics.step) {
          console.log('searching for window.funnelytics.step');
          return;
        }
        window.funnelytics.events.trigger(event, eventData);
        window.clearInterval(checker);
      }, 200);
    }
  } else {
    console.log(
      `flEvent dataType is expecting an object. Instead it's a(n) ${typeof data}`
    );
  }
}
if (typeof pageType === 'undefined') {
  console.error(
    'You need to declare a pageType in the page settings to track Funnelytics on Click Funnels pages.'
  );
}
switch (pageType) {
  case 'single-step':
    console.log('Is a single step form');
    $(function () {
      $('#cfAR').on('submit', function () {
        // check for all fields with the name selector 'name'. Store them in an array and then add them to a string.
        arrFormNameFieldValues = [];
        $('[name*="name"]:visible').each(function () {
          const formNameFieldName = $(this).attr('name');
          const formNameFieldValue = $(this).val();
          // console.log(`${formNameFieldName} has a value of ${formNameFieldValue}`)
          if (formNameFieldValue) {
            window.arrFormNameFieldValues.push(formNameFieldValue);
          }
        });
        const mainName = $('.product-name').eq(0).text();
        const bumpName = $('.product-name').eq(1).text();
        const mainPrice = $('.product-price')
          .eq(0)
          .text()
          .split('')
          .filter((letter) => {
            return letter.match(/[0-9\.]/i);
          })
          .join('');
        const bumpPrice = $('.product-price')
          .eq(1)
          .text()
          .split('')
          .filter((letter) => {
            return letter.match(/[0-9\.]/i);
          })
          .join('');
        const totalOrderValue =
          parseFloat(mainPrice || 0) + parseFloat(bumpPrice || 0);
        const visitorName = arrFormNameFieldValues
          .toString()
          .replace(/,/g, ' ');
        const visitorEmail = $('[name*="email"]').val();
        console.log('Purchase was made');
        // If Bump Was Taken Trigger actions
        if ($('.product-name').length !== 1) {
          // Trigger Funnelytics Actions for Main and Bump
          // main product
          flEvent('purchase', {
            mainProductName: mainName,
            mainProductPrice: mainPrice,
            name: visitorName,
            email: visitorEmail,
            orderTotal: totalOrderValue,
            purchaseBump: 'true',
          });
          // bump product
          flEvent('purchase', {
            bumpProductName: bumpName,
            bumpProductPrice: bumpPrice,
          });
        } else {
          // If bump was not taken, trigger Funnelytics Action for Main Only
          flEvent('purchase', {
            mainProductName: mainName,
            mainProductPrice: mainPrice,
            name: visitorName,
            email: visitorEmail,
            orderTotal: totalOrderValue,
            purchaseBump: 'false',
          });
        }
      });
    });
    break;
  case 'multi-step':
    console.log('Is a multi-step form');
    jQuery(function ($) {
      $('[href="#submit-form-2step"]').on('click', function () {
        formValValidation = [];
        $('.required1').each(function () {
          const visitorInfo = $(this).val();
          const formFieldName = $(this).attr('name');
          if (visitorInfo !== '' || undefined) {
            // console.log(formFieldName + ' has a value')
            window.formValValidation.push('true');
          } else if (formFieldName === undefined) {
            // console.log(formFieldName + ' has an element name that is not defined and wont count against validation')
            window.formValValidation.push('na');
          } else {
            // console.log(formFieldName + ' Does not have a value')
            window.formValValidation.push('false');
          }
        });
        jQuery(function () {
          const validFormArray = $.inArray('false', formValValidation);
          if (validFormArray !== -1) {
            console.log('do not trigger event.');
          } else {
            console.log('okay to trigger event.');
            arrNameFieldValues = [];
            arrFormNameFieldValues = [];
            $('[name*="name"]:visible').each(function () {
              const formNameFieldName = $(this).attr('name');
              const formNameFieldValue = $(this).val();
              // console.log(`${formNameFieldName} has a value of ${formNameFieldValue}`)
              if (formNameFieldValue) {
                window.arrFormNameFieldValues.push(formNameFieldValue);
              }
            });
            const visitorName = arrFormNameFieldValues
              .toString()
              .replace(/,/g, ' ');
            const visitorEmail = $('[name*="email"]').val();
            flEvent('form-submit', {
              name: visitorName,
              email: visitorEmail,
              formPath: pagePath,
              formStep: 1,
            });
          }
        });
      });
      $('#cfAR').on('submit', function () {
        const mainName = $('.product-name').eq(0).text();
        const bumpName = $('.product-name').eq(1).text();
        const mainPrice = $('.product-price')
          .eq(0)
          .text()
          .split('')
          .filter((letter) => {
            return letter.match(/[0-9\.]/i);
          })
          .join('');
        const bumpPrice = $('.product-price')
          .eq(1)
          .text()
          .split('')
          .filter((letter) => {
            return letter.match(/[0-9\.]/i);
          })
          .join('');
        const totalOrderValue =
          parseFloat(mainPrice || 0) + parseFloat(bumpPrice || 0);
        console.log('Purchase Was Made');
        // If Bump Was Taken Save Variables and Trigger actions
        if ($('.product-name').length !== 1) {
          // Trigger Funnelytics Actions for Main and Bump
          console.log('Main + Bump Products Were Purchased');
          // main product
          flEvent(
            'purchase', {
              mainProductName: mainName,
              mainProductPrice: mainPrice,
              orderTotal: totalOrderValue,
              purchaseBump: 'true',
            },
            function () {
              // continue with process..
            }
          );
          // bump product
          flEvent(
            'purchase', {
              bumpProductName: bumpName,
              bumpProductPrice: bumpPrice,
            },
            function () {
              // continue with process..
            }
          );
        } else {
          // Trigger Funnelytics Action for Main Only
          console.log('Main Product Only Was Purchased');
          flEvent(
            'purchase', {
              mainProductName: mainName,
              mainProductPrice: mainPrice,
              orderTotal: totalOrderValue,
              purchaseBump: 'false',
            },
            function () {
              // continue with process..
            }
          );
        }
      });
    });
    break;
  case 'addon':
    console.log('Is an upsell or downsell - single purchase only');
    jQuery(function ($) {
      $('a[href*="#yes"]').on('click', function () {
        const dataPurchase = $(this).attr('data-purchase');
        const dataPurchaseDecoded = JSON.parse(dataPurchase);
        // console.log(dataPurchase)
        const productId = dataPurchaseDecoded.product_id;
        console.log(productId);
        // Trigger Funnelytics Action For Purchase
        flEvent(
          'purchase', {
            productId,
            product: 'addon',
            pagePath,
          },
          function () {
            // continue with process..
          }
        );
      });
      $('a[href*="#no"]').on('click', function () {
        console.log('Addon Product was Rejected');
        // get productId from href
        // Trigger Funnelytics Action For Not Purchasing
        flEvent(
          'reject-click', {
            pagePath,
            product: 'addon',
          },
          function () {
            // continue with process..
          }
        );
      });
    });
    break;
  case 'addon-multiple':
    console.log('Is an upsell or downsell - 3 or more products');
    jQuery(function ($) {
      $('a[href*="#yes"]').on('click', function () {
        const prodAddonArr = $('[data-title*="bump-button"]:visible');
        for (let i = 0; i < prodAddonArr.length; i++) {
          if (prodAddonArr[i].innerText.trim().toLowerCase() === 'added') {
            console.log(`${i + 1} Product(s) Added`);
            const dataPurchase = $(this).attr('data-purchase');
            const dataPurchaseDecoded = JSON.parse(dataPurchase);
            console.log(dataPurchase);
            const prodId = dataPurchaseDecoded.product_id;
            console.log(prodId);
            // Trigger Funnelytics Action For Purchase(s)
            window.funnelytics.events.trigger(
              'purchase', {
                pagePath,
                addonNumber: i + 1,
              },
              function () {
                // continue with process..
              }
            );
          }
        }
      });
      $('a[href*="#no"]').on('click', function () {
        console.log('Addon Product was Rejected');
        // Trigger Funnelytics Action For Not Purchasing
        window.funnelytics.events.trigger(
          'reject-click', {
            pagePath,
            product: 'addon',
          },
          function () {
            // continue with process..
          }
        );
      });
    });
    break;
  case 'optin':
    console.log('Is an optin page');
    $('#cfAR').on('submit', function () {
      formValValidation = [];
      $('.required1').each(function () {
        const visitorInfo = $(this).val();
        const formFieldName = $(this).attr('name');
        if (visitorInfo !== '' || undefined) {
          // console.log(formFieldName + ' has a value')
          window.formValValidation.push('true');
        } else if (formFieldName === undefined) {
          // console.log(formFieldName + ' has an element name that is not defined and wont count against validation')
          window.formValValidation.push('na');
        } else {
          // console.log(formFieldName + ' Does not have a value')
          window.formValValidation.push('false');
        }
      });
      jQuery(function ($) {
        const validFormArray = $.inArray('false', formValValidation);
        if (validFormArray !== -1) {
          console.log('do not trigger event.');
        } else {
          console.log('okay to trigger event.');
          // check for all fields with the name selector 'name'. Store them in an array and then add them to a string.
          arrFormNameFieldValues = [];
          $('[name*="name"]:visible').each(function () {
            const formNameFieldName = $(this).attr('name');
            const formNameFieldValue = $(this).val();
            // console.log(`${formNameFieldName} has a value of ${formNameFieldValue}`)
            if (formNameFieldValue) {
              window.arrFormNameFieldValues.push(formNameFieldValue);
            }
          });
          const visitorName = arrFormNameFieldValues
            .toString()
            .replace(/,/g, ' ');
          const visitorEmail = $('[name*="email"]').val();
          flEvent('form-submit', {
            name: visitorName,
            email: visitorEmail,
            formTitle,
          });
        }
      });
    });
    break;
  default:
    console.log(`pageType "${pageType}" is not recognized`);
}