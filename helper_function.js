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