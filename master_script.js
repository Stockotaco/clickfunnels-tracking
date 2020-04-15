const pagePath = document.location.pathname.replace(/\/?(\?|#|$)/, '/$1');

function flEvent(event, data, sendToDl) {
  const eventData = data || {};
  // console.log(`the dataType is ${typeof(data)}`)
  if (typeof data === 'object') {
    // define the dlEvent
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
      }, 100);
    }
  } else {
    console.log(
      `flEvent dataType is expecting an object. Instead it's a(n) ${typeof data}`
    );
  }
}
function flIdentify(data, sendToDl) {
  const eventData = data || {};
  // check to see if Funnelytics has already identified the user or not
  if (!localStorage.getItem('flIdentified')) {
    // console.log(`the dataType is ${typeof(data)}`)
    if (typeof data === 'object') {
      // define the dlEvent
      const dlEvent = function () {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: `fl-identify`,
          eventData,
        });
        console.log(`fl-identify dataLayer event sent`);
      };
      if (!sendToDl) {
        // if the third function argument is falsy (empty), trigger the dataLayer event by default
        dlEvent();
      }
      try {
        window.funnelytics.events.trigger('identify', eventData);
        window.localStorage.setItem('flIdentified', 'true'); // set local storage identifying that an identify call has been sent
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
          window.funnelytics.events.trigger('identify', eventData);
          window.localStorage.setItem('flIdentified', 'true'); // set local storage identifying that an identify call has been sent
          window.clearInterval(checker);
        }, 100);
      }
    } else {
      console.log(
        `flEvent dataType is expecting an object. Instead it's a(n) ${typeof data}`
      );
    }
  } else {
    console.log('user is already identified to Funnelytics');
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
        prodProps = [];
        prodPropsPrice = [];
        $('#cfAR input[name="purchase[product_ids][]"]:checked').each(
          function () {
            // get the id, name, and price of all the checked products
            const prodId = $(this).val();
            const prodName = $(this).attr('data-product-name');
            const prodPrice = $(this).attr('data-product-amount');
            /* console.log(
		prodId + ' has a name of ' + prodName + ' and a price of ' + prodPrice
    ); */
            // push the data to an empty array
            window.prodProps.push({
              prodId,
              prodName,
              prodPrice: parseFloat(prodPrice || 0),
            });
            // push just the prices to an empty array
            window.prodPropsPrice.push(prodPrice);
          }
        );
        // get all the prices from array and add them together
        const numOr0 = (n) => (isNaN(n) ? 0 : n);
        const totalPriceFull = window.prodPropsPrice.reduce(
          (a, b) => +numOr0(a) + +numOr0(b)
        );
        const totalPrice = parseFloat(totalPriceFull);
        // console.log(totalPrice);
        // trigger flEvent for each product and it's data
        for (let i = 0; i < prodProps.length; i++) {
          // console.log(prodProps[i]);
          flEvent('purchase', prodProps[i]);
        }
        // check for all visible fields with the name selector 'name'. Store them in an array and then add them to a string.
        arrFormNameFieldValues = [];
        $('[name*="name"]:visible').each(function () {
          // const formNameFieldName = $(this).attr('name');
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
        flIdentify({
          name: visitorName,
          email: visitorEmail,
        });
      });
    });
    break;
  case 'multi-step':
    console.log('Is a multi-step form');
    jQuery(function ($) {
      $('[href="#submit-form-2step"]').on('click', function () {
        // step 1: check for valid form submission on step 1 of the multi-step order form.
        // check all required form fields to make sure that they have a name and a value.
        // Push true into an array if the field has a name and a value.
        // Push na if the element doesn't have a name.
        // Push False if the element has a name but no value.
        formValValidation = [];
        $('.required1').each(function () {
          const visitorInfo = $(this).val();
          const formFieldName = $(this).attr('name');
          if (visitorInfo !== '' || undefined) {
            // console.log(formFieldName + ' has a value')
            window.formValValidation.push('true');
          } else if (formFieldName === undefined) {
            // console.log(formFieldName + ' has an element name that is not defined and won't count against validation')
            window.formValValidation.push('na');
          } else {
            // console.log(formFieldName + ' Does not have a value')
            window.formValValidation.push('false');
          }
        });
        jQuery(function () {
          // check the array for the value false. If there is a false, that means there is a required field that has a name but now value.
          // therefore the form is not valid to be submitted.
          const validFormArray = $.inArray('false', formValValidation);
          // will return -1 if the array contains "false".
          if (validFormArray !== -1) {
            console.log('do not trigger event.');
          } else {
            console.log('okay to trigger event.');
            arrNameFieldValues = [];
            arrFormNameFieldValues = [];
            $('[name*="name"]:visible').each(function () {
              // const formNameFieldName = $(this).attr('name');
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
              formPath: pagePath,
              formStep: 1,
            });
            flIdentify({
              name: visitorName,
              email: visitorEmail,
            });
          }
        });
      });
      $('#cfAR').on('submit', function () {
        // step 2: trigger purchase events
        prodProps = [];
        prodPropsPrice = [];
        $('#cfAR input[name="purchase[product_ids][]"]:checked').each(
          function () {
            // get the id, name, and price of all the checked products
            const prodId = $(this).val();
            const prodName = $(this).attr('data-product-name');
            const prodPrice = $(this).attr('data-product-amount');
            /* console.log(
		prodId + ' has a name of ' + prodName + ' and a price of ' + prodPrice
    ); */
            // push the data to an empty array
            window.prodProps.push({
              prodId,
              prodName,
              prodPrice: parseFloat(prodPrice || 0),
            });
            // push just the prices to an empty array
            window.prodPropsPrice.push(prodPrice);
          }
        );
        // get all the prices and add them together
        const numOr0 = (n) => (isNaN(n) ? 0 : n);
        const totalPriceFull = window.prodPropsPrice.reduce(
          (a, b) => +numOr0(a) + +numOr0(b)
        );
        const totalPrice = parseFloat(totalPriceFull);
        // console.log(totalPrice);
        // trigger flEvent for each product and it's data
        for (let i = 0; i < prodProps.length; i++) {
          // console.log(prodProps[i]);
          flEvent('purchase', prodProps[i]);
        }
        // check for all visible fields with the name selector 'name'. Store them in an array and then add them to a string.
        arrFormNameFieldValues = [];
        $('[name*="name"]:visible').each(function () {
          // const formNameFieldName = $(this).attr('name');
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
        flIdentify({
          name: visitorName,
          email: visitorEmail,
        });
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
          'purchase',
          {
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
          'reject-click',
          {
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
      prodProps = [];
      prodPropsPrice = [];
      $('#cfAR input[name="purchase[product_ids][]"]:checked').each(
        function () {
          // get the id, name, and price of all the checked products
          const prodId = $(this).val();
          const prodName = $(this).attr('data-product-name');
          const prodPrice = $(this).attr('data-product-amount');
          /* console.log(
		prodId + ' has a name of ' + prodName + ' and a price of ' + prodPrice
    ); */
          // push the data to an empty array
          window.prodProps.push({
            prodId,
            prodName,
            prodPrice: parseFloat(prodPrice || 0),
          });
          // push just the prices to an empty array
          window.prodPropsPrice.push(prodPrice);
        }
      );
      // get all the prices and add them together
      const numOr0 = (n) => (isNaN(n) ? 0 : n);
      const totalPriceFull = window.prodPropsPrice.reduce(
        (a, b) => +numOr0(a) + +numOr0(b)
      );
      const totalPrice = parseFloat(totalPriceFull);
      // console.log(totalPrice);
      // trigger flEvent for each product and it's data
      for (let i = 0; i < prodProps.length; i++) {
        // console.log(prodProps[i]);
        flEvent('purchase', prodProps[i]);
      }
    });
    $('a[href*="#no"]').on('click', function () {
      console.log('Addon Product was Rejected');
      // Trigger Funnelytics Action For Not Purchasing
      window.funnelytics.events.trigger(
        'reject-click',
        {
          pagePath,
          product: 'addon',
        },
        function () {
          // continue with process..
        }
      );
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
            // const formNameFieldName = $(this).attr('name');
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
            pagePath,
            formTitle,
          });
          flIdentify({
            name: visitorName,
            email: visitorEmail,
          });
        }
      });
    });
    break;
  default:
    console.log(`pageType "${pageType}" is not recognized`);
}
