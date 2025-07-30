// Variable to store fetched travel data
let travelData = null;

// Fetch the JSON data
fetch('travel_recommendation_api.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        travelData = data; // Store fetched data for later use in search
        console.log(data); // Log the data to check if it's fetched correctly
        // Only check for search query if there is one in the URL
        if (window.location.pathname.includes('travel_recommendation.html')) {
            checkForSearchQuery();
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

// Function to display recommendations based on keyword
function displayRecommendations(keyword) {
    const recommendationsContainer = document.querySelector('.recommendations');
    recommendationsContainer.innerHTML = ''; // Clear previous results

    let matchedItems = [];

    // Normalize keyword to lowercase
    const normalizedKeyword = keyword.toLowerCase();

    // Match keyword with categories
    if (normalizedKeyword.includes('beach')) {
        matchedItems = travelData.beaches;
    } else if (normalizedKeyword.includes('temple')) {
        matchedItems = travelData.temples;
    } else if (normalizedKeyword.includes('country')) {
        travelData.countries.forEach(country => {
            matchedItems.push(...country.cities);
        });
    }

    // Display matched items
    matchedItems.forEach(item => {
        createRecommendationItem(recommendationsContainer, item);
    });

    // Show the recommendations container if it was previously hidden
    recommendationsContainer.style.display = 'block';
}

// Helper function to create recommendation items
function createRecommendationItem(container, item) {
    const recommendationItem = document.createElement('div');
    recommendationItem.className = 'recommendation-item';

    const image = document.createElement('img');
    image.src = item.imageUrl;
    image.alt = item.name;

    const descriptionContainer = document.createElement('div');
    
    const name = document.createElement('h3');
    name.textContent = item.name;

    const description = document.createElement('p');
    description.textContent = item.description;

    descriptionContainer.appendChild(name);
    descriptionContainer.appendChild(description);
    
    recommendationItem.appendChild(image);
    recommendationItem.appendChild(descriptionContainer);
    container.appendChild(recommendationItem);
}

// Function to clear recommendations
function clearRecommendations() {
    const recommendationsContainer = document.querySelector('.recommendations');
    recommendationsContainer.innerHTML = ''; // Clear all results
    recommendationsContainer.style.display = 'none'; // Hide the container
}

// Set up event listener for the search form
document.querySelector('.search-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    const searchInput = document.querySelector('input[name="search"]').value;
    if (window.location.pathname.includes('travel_recommendation.html')) {
        // Display recommendations on the home page
        displayRecommendations(searchInput);
    } else {
        // Redirect to home page with search query
        window.location.href = `travel_recommendation.html?search=${encodeURIComponent(searchInput)}`;
    }
});

// Set up event listener for the clear button
document.querySelector('.clear-btn').addEventListener('click', function() {
    clearRecommendations();
});

// Function to check URL for search query and display results on home page
function checkForSearchQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
        displayRecommendations(searchQuery);
    }
}

// Ensure the recommendations container is hidden by default
document.addEventListener('DOMContentLoaded', function() {
    const recommendationsContainer = document.querySelector('.recommendations');
    recommendationsContainer.style.display = 'none';
});