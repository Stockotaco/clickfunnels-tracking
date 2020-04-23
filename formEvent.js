function getEmail() {
  const visitorEmail = $('[name*="email"]').val();
  return visitorEmail;
}
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
      // console.error(error);
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
// eslint-disable-next-line consistent-return
function nameFields() {
  // check for all fields with the name selector 'name'. Store them in an array and then add them to a string.
  arrFormNameFieldValues = [];
  $('[name*="name"]:visible').each(function () {
    // const formNameFieldName = $(this).attr('name');
    const formNameFieldValue = $(this).val();
    // console.log(`${formNameFieldName} has a value of ${formNameFieldValue}`);
    if (formNameFieldValue) {
      window.arrFormNameFieldValues.push(formNameFieldValue);
    }
  });
  const visitorName = arrFormNameFieldValues.toString().replace(/,/g, ' ');
  // console.log(visitorName);
  if (visitorName) {
    return visitorName;
  }
}
function formEvent(formId, formName, reqClassName) {
  $(formId).on('submit', function () {
    /* $(`[class*="${reqClassName}"]:visible`).each(function () {
      // console.log($(this).val());
    }); */
    const visitorName = nameFields();
    const visitorEmail = getEmail();
    flEvent('form-submit', {
      name: visitorName,
      email: visitorEmail,
      form: formName,
    });
  });
}
