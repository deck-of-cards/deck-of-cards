export function on (target, eventName, handler) {
  target._events || (target._events = []);

  target._events.push({
    eventName,
    handler
  });
}

export function once (target, eventName, handler) {
  target._events || (target._events = []);

  target._events.push({
    eventName,
    once: true,
    handler
  });
}

export function trigger (target, eventName, value) {
  target._events || (target._events = []);

  target._events
    .filter(event => event.eventName === eventName)
    .forEach(event => event.handler(value));
}

export function off (target, eventName, handler) {
  target._events || (target._events = []);

  if (eventName && handler) {
    target._events = target._events.filter(event => {
      return event.eventName !== eventName || event.handler !== handler;
    });
  } else if (eventName) {
    target._events = target._events.filter(event => {
      return event.eventName !== eventName;
    });
  } else {
    target._events = [];
  }
}
