export function createRunLog(config) {
  const startedAt = new Date().toISOString();
  const events = [];

  return {
    startedAt,
    events,
    step(name, details = {}) {
      const event = {
        at: new Date().toISOString(),
        name,
        details,
      };
      events.push(event);
      if (!config.json) {
        console.log(`\n[${event.at}] ${name}`);
        if (Object.keys(details).length > 0) {
          console.log(JSON.stringify(details, null, 2));
        }
      }
      return event;
    },
    summary(extra = {}) {
      return {
        startedAt,
        finishedAt: new Date().toISOString(),
        mode: config.mode,
        eventCount: events.length,
        events,
        ...extra,
      };
    },
  };
}
