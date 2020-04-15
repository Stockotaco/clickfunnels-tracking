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

// Used as a helper function to only send name and email for things like purchases.
// Not used as a form-submit event with name and email properties.
function flIdentify(data, sendToDl) {
  const eventData = data || {};
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
        window.localStorage.setItem('flIdentified', 'true');
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
          window.localStorage.setItem('flIdentified', 'true');
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

// Check and record purchases by productId
