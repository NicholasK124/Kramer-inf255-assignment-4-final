"use strict";

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

const animals = [
	{ id: 1, name: "Luna", species: "cat", age: 3, adopted: false },
	{ id: 2, name: "Biscuit", species: "dog", age: 7, adopted: true },
	{ id: 3, name: "Pepper", species: "cat", age: 1, adopted: true },
	{ id: 4, name: "Moose", species: "dog", age: 5, adopted: false },
	{ id: 5, name: "Charly", species: "dog", age: 4, adopted: false },
	{ id: 6, name: "Bill", species: "cat", age: 0.5, adopted: true },
	{ id: 7, name: "Chompers", species: "rabbit", age: 0.5, adopted: false },
	{ id: 8, name: "Beowulf", species: "dog", age: 7, adopted: true },
];

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

		const status = document.createElement("p");
		status.textContent = animal.adopted ? "Adopted" : "Available";

		const button = document.createElement("button");
		button.type = "button";
		button.textContent = animal.adopted ? "Return" : "Adopt";

		// This callback doesn't run now. It runs later, each time the user
		// clicks this card's button. It knows which animal to change because
		// the arrow function was created inside this forEach() callback, so it
		// remembers this card's animal (a closure) and passes its id along.
		button.addEventListener("click", () => toggleAdoption(animal.id));

		card.append(heading, details, status, button);
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

// Display the original list and the count when the page first opens.
displayAnimals(animals);
updateCount();
