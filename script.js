/**
 * Retrieves the location based on the user's geolocation.
 * Shows a spinner while fetching the location and updates the input fields with the obtained location data.
 */
function getLocation() {
  var spinner = document.getElementById('spinner');
  spinner.classList.toggle('show', true);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(fetchReverseGeocoding, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

/**
 * Fetches reverse geocoding data based on the provided position (latitude and longitude).
 * Updates the input fields with the obtained location data.
 * @param {Position} position - The position object containing latitude and longitude.
 */
function fetchReverseGeocoding(position) {
  var spinner = document.getElementById('spinner');

  // Get latitude and longitude
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  var apiKey = "YOUR_KEY";
  var url = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=${apiKey}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      displayLocation(data);

      // Remove spinner
      spinner.classList.toggle('show', false);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);

      // Remove spinner
      spinner.classList.toggle('show', false);
    });
}

/**
 * Updates input fields with the obtained location data.
 * @param {Object} data - The location data.
 */
function displayLocation(data) {
  var city = data.address.county;
  var neighbourhood = data.address.neighbourhood;
  var state = data.address.state;
  var road = data.address.road;
  var displayName = data.display_name;

  document.getElementById("_rsi-field-city").value = city;
  document.getElementById("_rsi-field-civic_number").value = neighbourhood;
  document.getElementById("_rsi-field-province_country_field").value = getMostSimilarValue(state);
}

/**
 * Displays an error message based on the provided error object.
 * @param {PositionError} error - The error object containing error code and message.
 */
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}

/**
 * Finds the most similar option value in the select element based on the input value.
 * @param {string} value - The input value to find the most similar option value for.
 * @returns {string} - The most similar option value.
 */
function findSimilarValue(value) {
  var selectElement = document.getElementById("_rsi-field-province_country_field");
  var options = selectElement.options;
  var mostSimilarOption;
  var highestSimilarity = 0;

  for (var i = 0; i < options.length; i++) {
    var optionValue = options[i].value;
    var similarity = calculateSimilarity(value, optionValue);
    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      mostSimilarOption = options[i];
    }
  }

  return mostSimilarOption.value;
}

/**
 * Calculates the similarity between two strings based on their characters.
 * @param {string} inputValue - The first string.
 * @param {string} optionValue - The second string.
 * @returns {number} - The similarity score between the two strings.
 */
function calculateSimilarity(inputValue, optionValue) {
  var similarity = 0;
  var minLength = Math.min(inputValue.length, optionValue.length);

  for (var i = 0; i < minLength; i++) {
    if (inputValue[i].toLowerCase() === optionValue[i].toLowerCase()) {
      similarity++;
    } else {
      break;
    }
  }

  return similarity;
}

/**
 * Retrieves the most similar option value for the provided input value.
 * @param {string} value - The input value to find the most similar option value for.
 * @returns {string} - The most similar option value.
 */
function getMostSimilarValue(value) {
  var mostSimilarValue = findSimilarValue(value);
  console.log("Most Similar Value: " + mostSimilarValue);
  return mostSimilarValue;
}

/**
 * Binds the getLocation function to both click and focus events for the specified element.
 * @param {string} element - The ID of the element to bind the events to.
 */
function bindLocationGetter(element) {
  var element = document.getElementById(element);
  if (element) {
    console.log("Element with id '_rsi-field-address' found.");
    // Add click event listener
    element.addEventListener("click", getLocation);
    // Add focus event listener
    element.addEventListener("focus", function () {
      console.log('input focus');
      getLocation();
    });
  } else {
    console.error("Element with id '_rsi-field-address' not found.");
  }
}

/**
 * Adds a geolocation button and spinner next to the specified input element.
 */
function addGeoLocatorButton() {
  var existingButton = document.getElementById('getLocationButton');

  if (!existingButton) {
    // Create a button element
    var button = document.createElement('div');

    // Set button text
    button.textContent = 'Obtener mi ciudad 📍';

    // Set button ID
    button.id = 'getLocationButton';

    // Add event listener to the button
    button.addEventListener('click', getLocation);

    // Find the input element by its ID
    var inputElement = document.getElementById('_rsi-field-address');

    // Append the button after the input element
    inputElement.parentNode.insertBefore(button, inputElement.nextSibling);

    // Check if spinner already exists
    var existingSpinner = document.getElementById('spinner');

    if (!existingSpinner) {
      // Create spinner
      var spinner = document.createElement('span');
      spinner.id = 'spinner';
      spinner.className = 'spinner-border spinner-border-sm';
      spinner.setAttribute('role', 'status');
      spinner.setAttribute('aria-hidden', 'true');

      // Append spinner after the button
      button.parentNode.insertBefore(spinner, button.nextSibling);
    }
  }
}

/**
 * Handles the click or focus event and determines whether to add a geolocation button.
 * @param {Event} event - The event object.
 */
function getLocatorEventHandler(event) {
  // Retrieve the ID of the clicked element
  var clickedElementId = event.target.id;

  // Log the ID to the console
  console.log('Clicked element ID:', clickedElementId);
  if (clickedElementId == "_rsi-field-address") {
    addGeoLocatorButton();
  }
}

// Add event listener for focus on the document
document.addEventListener('focus', getLocatorEventHandler, true); // Capture phase

// Add event listener for click on the document
document.addEventListener('click', getLocatorEventHandler);
