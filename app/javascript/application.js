// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
//import "@hotwired/turbo-rails"
//import "controllers"
//= require toastr


document.addEventListener("DOMContentLoaded", () => {
      const lookupButton = document.getElementById("lookup_button");
      const quizNameLookup = document.getElementById("quiz_name_lookup");
      const quizNameInput = document.getElementById("quiz_name");

      lookupButton.addEventListener("click", async () => {
        // Fetch distinct quiz names from the server
        const response = await fetch('/quizzes/lookup'); // Adjust the route if needed
        const quizNames = await response.json();

        // Populate the lookup dropdown
        quizNameLookup.innerHTML = '';
        quizNames.forEach(name => {
          const li = document.createElement("li");
          li.className = "list-group-item list-group-item-action";
          li.textContent = name;
          li.addEventListener("click", () => {
            quizNameInput.value = name; // Set the selected name to the input field
            quizNameLookup.style.display = "none"; // Hide the dropdown
          });
          quizNameLookup.appendChild(li);
        });
        quizNameLookup.style.display = "block"; // Show the dropdown
      });
    });
