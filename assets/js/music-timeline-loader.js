function loadMusicTimeline() {
  // const timelineContainer = document.querySelector('.timeline'); // Old line
  const timelineContainer = document.getElementById('music-timeline-container-index'); // New line

  if (!timelineContainer) {
    console.error('Music timeline container "music-timeline-container-index" not found.');
    return;
  }

  fetch('assets/music/json/events.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(events => {
      // Sort events by dateMMYYYY
      events.sort((a, b) => {
        const toComparableString = (dateStr) => {
          if (!dateStr || typeof dateStr !== 'string' || !dateStr.includes('/')) {
            return '000000';
          }
          const parts = dateStr.split('/');
          const month = parts[0].padStart(2, '0');
          const year = parts[1];
          return year + month;
        };
        const dateA = toComparableString(a.dateMMYYYY);
        const dateB = toComparableString(b.dateMMYYYY);
        if (dateA < dateB) { return 1; }
        if (dateA > dateB) { return -1; }
        return 0;
      });

      timelineContainer.innerHTML = '';

      if (events.length === 0) {
        timelineContainer.innerHTML = '<p>No music events to display.</p>';
        return;
      }

      let processedEvents = [];
      let eventsProcessedCount = 0;
      const totalEvents = events.length;

      const createEventElement = (currentEvent, imagePaths, eventIndex) => {
        const timelineEventDiv = document.createElement('div');
        // timelineEventDiv.classList.add('timeline-event'); // Original class from resume items
        timelineEventDiv.setAttribute('data-aos', 'fade-up');
        timelineEventDiv.setAttribute('data-aos-delay', '100');

        // Add the new class for simple timeline styling
        timelineEventDiv.classList.add('music-event-item');

        // The 'card' div will act as the main content container for styling, similar to .timeline-content-wrapper
        // If a specific 'card' class is not desired for some reason, this could be a generic div
        // or the styling could target .music-event-item > div directly.
        // For now, let's assume a 'card'-like structure or that styling will handle it.
        // The prompt asks for the card to be appended directly to eventDiv.
        // We will create a 'card' div here to hold all content.

        const cardDiv = document.createElement('div');
        // cardDiv.classList.add('card'); // Add 'card' class if Bootstrap card styling is desired, or style via .music-event-item .card
        // For now, let's rely on the CSS provided for `.music-event-item .card`
        // and assume the JS should create a div that will be styled as a card by that CSS.
        // If no specific card class is added by JS, the CSS needs to be general enough,
        // e.g. styling the first div child of .music-event-item or a specific class we add here.
        // Let's add a generic content holder class that CSS can target if '.card' isn't automatically used.
        cardDiv.classList.add('music-event-content'); // A generic class for the content block

        if (imagePaths && imagePaths.length > 0) {
          const collageId = `collage-${eventIndex}`;
          const collageContainerElement = document.createElement('div');
          collageContainerElement.id = collageId;
          collageContainerElement.classList.add('image-collage-container');

          if (imagePaths.length === 1) {
            collageContainerElement.classList.add('single-image');
            let img = document.createElement('img');
            img.src = imagePaths[0];
            img.alt = `${currentEvent.eventName} collage image`;
            img.classList.add('collage-image');
            collageContainerElement.appendChild(img);
          } else {
            collageContainerElement.classList.add('standard-layout');
            let largeImg = document.createElement('img');
            largeImg.src = imagePaths[0];
            largeImg.alt = `${currentEvent.eventName} main image`;
            largeImg.classList.add('collage-image', 'collage-image-large');
            collageContainerElement.appendChild(largeImg);

            if (imagePaths.length > 1) {
              let smallImagesWrapper = document.createElement('div');
              smallImagesWrapper.classList.add('small-images-wrapper');
              let numSmallImages = imagePaths.length - 1;
              smallImagesWrapper.classList.add('count-' + numSmallImages);
              for (let j = 1; j < imagePaths.length; j++) {
                let smallImg = document.createElement('img');
                smallImg.src = imagePaths[j];
                smallImg.alt = `${currentEvent.eventName} thumbnail ${j}`;
                smallImg.classList.add('collage-image', 'collage-image-small');
                smallImagesWrapper.appendChild(smallImg);
              }
              collageContainerElement.appendChild(smallImagesWrapper);
            }
          }
          cardDiv.appendChild(collageContainerElement);
        }

        const dateMarkerDiv = document.createElement('div');
        dateMarkerDiv.className = 'timeline-date-marker';
        dateMarkerDiv.textContent = currentEvent.dateMMYYYY;
        cardDiv.appendChild(dateMarkerDiv);

        const timelineContentElement = document.createElement('div');
        timelineContentElement.classList.add('timeline-content');
        const eventNameH3 = document.createElement('h3');
        eventNameH3.textContent = currentEvent.eventName;
        timelineContentElement.appendChild(eventNameH3);
        cardDiv.appendChild(timelineContentElement);

        timelineEventDiv.appendChild(cardDiv); // Append the card (or content block) to the main event div
        return timelineEventDiv;
      };

      function renderTimelineInOrder() {
        let displayedEventCount = 0;
        processedEvents.forEach(processedEventWrapper => {
          if (processedEventWrapper.status === 'ready' && processedEventWrapper.domElement) {
            timelineContainer.appendChild(processedEventWrapper.domElement);
            displayedEventCount++;
          } else {
            if (processedEventWrapper.status === 'load_failed') {
              console.warn('Event skipped (primary image load failed):', processedEventWrapper.eventData.eventName);
            } else if (!processedEventWrapper.domElement &&
                       processedEventWrapper.status !== 'pending' &&
                       processedEventWrapper.status !== 'loading_primary') {
              console.warn('Event skipped (no DOM element but was processed):', processedEventWrapper.eventData.eventName);
            }
          }
        });

        if (displayedEventCount === 0 && totalEvents > 0) {
          timelineContainer.innerHTML = '<p>No music events could be displayed. Please check data or image paths.</p>';
        }
      }

      // Populate processedEvents with initial state
      events.forEach(event => { // Iterate over original events array
        processedEvents.push({
          eventData: event,
          status: 'pending',
          domElement: null
        });
      });

      // Process each event
      processedEvents.forEach((processedEventWrapper, originalIndex) => {
        const event = processedEventWrapper.eventData;
        let imagesToDisplayInCollage = [];

        if (event.imageDir && typeof event.imageDir === 'string' && event.imageDir.trim() !== '') {
          for (let i = 1; i <= 5; i++) {
            imagesToDisplayInCollage.push(`assets/img/events/${event.imageDir}/${i}.jpg`);
          }
        } else if (event.imageUrls && Array.isArray(event.imageUrls) && event.imageUrls.length > 0) {
          imagesToDisplayInCollage = event.imageUrls.slice(0, 5).map(imgName => `assets/music/images/${imgName}`);
        }

        if (event.imageDir && typeof event.imageDir === 'string' && event.imageDir.trim() !== '' && imagesToDisplayInCollage.length > 0) {
          processedEventWrapper.status = 'loading_primary';
          let primaryImage = new Image();
          primaryImage.onload = function() {
            console.log('Primary image loaded for imageDir event:', event.eventName, 'Path:', imagesToDisplayInCollage[0]);
            processedEventWrapper.domElement = createEventElement(event, imagesToDisplayInCollage, originalIndex);
            processedEventWrapper.status = 'ready';
            eventsProcessedCount++;
            if (eventsProcessedCount === totalEvents) {
              renderTimelineInOrder();
            }
          };
          primaryImage.onerror = function() {
            console.warn('Primary image NOT loaded for imageDir event:', event.eventName, 'Skipping. Path:', imagesToDisplayInCollage[0]);
            processedEventWrapper.status = 'load_failed';
            eventsProcessedCount++;
            if (eventsProcessedCount === totalEvents) {
              renderTimelineInOrder();
            }
          };
          primaryImage.src = imagesToDisplayInCollage[0];
        } else {
          processedEventWrapper.domElement = createEventElement(event, imagesToDisplayInCollage, originalIndex);
          processedEventWrapper.status = (processedEventWrapper.domElement ? 'ready' : 'load_failed');
          eventsProcessedCount++;
          if (eventsProcessedCount === totalEvents) {
            renderTimelineInOrder();
          }
        }
      });
    })
    .catch(error => {
      console.error('Error fetching or processing music events:', error);
      if (timelineContainer) { // Ensure timelineContainer exists before trying to set its innerHTML
        const errorP = document.createElement('p');
        errorP.textContent = 'Could not load music events.';
        errorP.style.color = 'red';
        timelineContainer.appendChild(errorP);
      }
    });
}
