"use strict";

//importing dayjs library
import dayjs from "dayjs";

/*
 * Animal Adoption Board
 *
 * EXTRA CREDIT: If you build any Assignment 4 extra credit features, list
 * them here (see README.md). Features that are not listed here will not be
 * graded.
 *
 *   -
 *   -
 */

// ------------------------------------
// Animal Data
// ------------------------------------

let animals = [];

// What the user currently wants to see. The page controls change these.
let activeFilter = "all";
let activeSort = "default";

// ------------------------------------
// Display Animals
// ------------------------------------

// Clears the list and draws one card for each animal in animalArray.
// It draws whatever array it is given, so updateDisplay() decides which
// animals to show and in what order.
function displayAnimals(animalArray) {
  const animalList = document.querySelector("#animal-list");
  animalList.innerHTML = "";

  if (animalArray.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "There are no animals to show.";
    emptyMessage.classList.add("empty-message");
    animalList.appendChild(emptyMessage);
    return;
  }

  animalArray.forEach((animal) => {
    const card = document.createElement("article");
    card.classList.add("animal-card");

    // The adopted class lets style.css gray out adopted animals.
    if (animal.adopted) {
      card.classList.add("adopted");
    }

    const heading = document.createElement("h3");
    heading.textContent = animal.name;

    const details = document.createElement("p");
    details.textContent = `${animal.species}, ${animal.age} years old`;

    const statusText = document.createElement("p");
    statusText.textContent = animal.adopted ? "Adopted" : "Available";

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = animal.adopted ? "Return" : "Adopt";

    // This callback doesn't run now. It runs later, each time the user
    // clicks this card's button. It knows which animal to change because
    // the arrow function was created inside this forEach() callback, so it
    // remembers this card's animal (a closure) and passes its id along.
    button.addEventListener("click", () => toggleAdoption(animal.id));

    //TODO 4

    // Format the arrival date and calculate how many days ago it was.
    const arrival = document.createElement("p");
    const arrivalDate = dayjs(animal.intakeDate).format("MMM D, YYYY");
    const daysAgo = dayjs().diff(animal.intakeDate, "day");

    arrival.textContent = `Arrived ${arrivalDate} (${daysAgo} days ago)`;

    card.append(heading, details, arrival, statusText, button);
    animalList.appendChild(card);
  });
}

// ------------------------------------
// Adopt or Return an Animal
// ------------------------------------

// Flips one animal between available and adopted, then redraws the page.
function toggleAdoption(animalId) {
  const animal = animals.find((a) => a.id === animalId);

  // find() returns undefined when nothing matches, so stop here instead of
  // causing an error on the next line.
  if (!animal) {
    return;
  }

  animal.adopted = !animal.adopted;
  updateDisplay();
}

// ------------------------------------
// Filter, Sort, and Update
// ------------------------------------

// Builds the list the user asked for (activeFilter and activeSort), draws
// it, and refreshes the count.
function updateDisplay() {
  // sort() rearranges the array it is called on. Working on a copy leaves
  // the animals array in its original order, so "Original order" still
  // has something to go back to.
  let visible = animals.slice();

  if (activeFilter === "available") {
    visible = visible.filter((a) => !a.adopted);
  } else if (activeFilter === "adopted") {
    visible = visible.filter((a) => a.adopted);
  }

  if (activeSort === "name") {
    visible.sort((a, b) => a.name.localeCompare(b.name));
  } else if (activeSort === "age") {
    // A negative result puts a before b, so smaller ages come first.
    visible.sort((a, b) => a.age - b.age);
  }

  displayAnimals(visible);
  updateCount();
}

// ------------------------------------
// Available Count
// ------------------------------------

// Counts from the full animals array, not the visible cards, so the
// message doesn't change when the user filters or sorts.
function updateCount() {
  const countText = document.querySelector("#animal-count");
  const available = animals.filter((a) => !a.adopted);
  countText.textContent = `${available.length} of ${animals.length} animals are available for adoption.`;
}

// ------------------------------------
// Page Controls
// ------------------------------------

const allButton = document.querySelector("#show-all");
const availableButton = document.querySelector("#show-available");
const adoptedButton = document.querySelector("#show-adopted");
const sortSelect = document.querySelector("#sort-animals");

// All three filter buttons do the same thing with a different value, so
// they share this function.
function setFilter(filter) {
  activeFilter = filter;
  updateDisplay();
}

allButton.addEventListener("click", () => setFilter("all"));
availableButton.addEventListener("click", () => setFilter("available"));
adoptedButton.addEventListener("click", () => setFilter("adopted"));

sortSelect.addEventListener("change", () => {
  activeSort = sortSelect.value;
  updateDisplay();
});

// async function loadAnimals() {
//   //Finds the HTML elements that we need to display
//   const countText = document.querySelector("#animal-count");
//   const animalList = document.querySelector("#animal-list");

//   countText.textContent = "Loading...";
//   animalList.innerHTML = "";
// }

// //fetch() is used to get the animals.json file, and await is used to pause the response until the file is found.
// try {
//   const response = await fetch("animals.json");

//   //Checks is the response from fetch() is ok, if it isn't then an error is thrown in.
//   if (!response.ok) {
//     throw new Error(`Request failed with status ${response.status}`);
//   }

//   //Convert reponse to JSON
//   animals = await response.json();

//   //Refresh the animal cards and count
//   updateDisplay();
// } catch (error) {
//   // Logging error message for debugging
//   console.error("Error loading animals:", error);

//   countText.textContent = "";
//   animalList.innerHTML = "";

//   //Create paragragh element for error
//   const errorMessage = document.createElement("p");

//   //Give the error its message
//   errorMessage.textContent =
//     "Sorry, the animals couldn't be loaded. Try refreshing the page.";

//   errorMessage.classList.add("error-message");

//   //Put element into animal list
//   animals.appendChild(errorMessage);
// }

// //Load the Message
// loadAnimals();

// --^---------------------PREVIOUS CODE------------------------^--
// WAS RUNNING INTO ISSUES WITH THE CODE THAT I COMMENTED OUT AS
// THE LOADING MESSAGE WASN'T LEAVING AND ANIMALS WEREN'T LOADING.

// Code Generated by AI: Helped organize the async loading
// function and explain its loading, success, and error states.
async function loadAnimals() {
  const countText = document.querySelector("#animal-count");
  const animalList = document.querySelector("#animal-list");

  // Show feedback while the data is being requested.
  countText.textContent = "Loading animals...";
  animalList.innerHTML = "";

  try {
    // await pauses this async function while the request waits,
    // but the browser can still respond to the user.
    const response = await fetch("/animals.json");

    // fetch() can return a response for a failed HTTP status,
    // so check whether the server reports success.
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    // Convert the JSON response into JavaScript data.
    animals = await response.json();

    // Draw the cards and replace the loading message with the count.
    updateDisplay();
  } catch (error) {
    console.error("Error loading animals:", error);

    countText.textContent = "";
    animalList.innerHTML = "";

    const errorMessage = document.createElement("p");
    errorMessage.textContent =
      "Sorry, the animals couldn't be loaded. Try refreshing the page.";
    errorMessage.classList.add("error-message");

    animalList.appendChild(errorMessage);
  }
}

// Start loading the data when the page opens.
loadAnimals();

//TODO 4

// Format the arrival date and calculate how many days ago it was.
const arrival = document.createElement("p");
const arrivalDate = dayjs(animal.intakeDate).format("MMM D, YYYY");
const daysAgo = dayjs().diff(animal.intakeDate, "day");

arrival.textContent = `Arrived ${arrivalDate} (${daysAgo} days ago)`;

card.append(heading, details, arrival, statusText, button);
