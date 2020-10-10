function fetchEventStatus(): void {
  const setEventFinished = (item: Element) => {
    item.classList.add('del');
    const icon = item.querySelector('img.icon');
    icon?.setAttribute('style', 'visibility: hidden');
    item.parentNode?.appendChild(item);
  };

  const setEventUnfinished = (item: Element) => {
    item.classList.remove('del');
    const icon = item.querySelector('img.icon');
    icon?.setAttribute('style', '');
  };

  const makePromises = () => {
    const eventItems = document.querySelectorAll(
      "aside[data-block='dcpc_events'] .BarCard > .BarCard-item",
    );
    const promises: Promise<string | null>[] = []; // return string if event is done
    const doneEventsCached = JSON.parse(localStorage.getItem('done_events') || '[]');

    eventItems.forEach((item) => {
      const eventLink = item.querySelector('a');
      const eventCourse = item.querySelector('small');
      const eventName = eventLink!.text + eventCourse!.textContent;

      if (doneEventsCached.includes(eventName)) {
        setEventFinished(item);
      }

      promises.push(
        (async () => {
          const res = await fetch(eventLink!.href);
          const data = await res.text();
          const eventDetails = new DOMParser().parseFromString(data, 'text/html');
          const submit = eventDetails.getElementsByClassName('submissionstatussubmitted');
          if (submit.length > 0) {
            if (!item.classList.contains('del')) {
              setEventFinished(item);
            }
            return eventName;
          } else {
            setEventUnfinished(item);
            return null;
          }
        })(),
      );
    });
    return promises;
  };

  Promise.all(makePromises()).then((responses) => {
    const doneEvents = responses.filter((r) => r !== null);
    localStorage.setItem('done_events', JSON.stringify(doneEvents));
  });
}

export { fetchEventStatus };
