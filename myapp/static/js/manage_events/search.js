export function setupSearch(resultsList, searchInput) {
  searchInput.addEventListener('keyup', function (event) {
    const query = searchInput.value.trim();
    fetch(`/filter-events/?query=${query}`)
      .then(response => response.json())
      .then(data => {
        resultsList.innerHTML = "";
        data.events.forEach(event => {
          const li = document.createElement("li");
          li.className = "list-group-item d-flex justify-content-between align-items-center";
          li.innerHTML = `
            <span>${event.name}</span>
            <button class="btn btn-sm btn-outline-primary view-button"
                    onclick="showEventDetails(this)"
                          data-start-date="${event.startDate}"
                          data-end-date="${event.endDate}"
                        data-place="{{ event.place.name }}"
                          data-name="${event.name}">
              <i class="fa-solid fa-eye"></i>Ver
            </button>
          `;
          resultsList.appendChild(li);
        });
      })
      .catch(error => {
        console.error("Error al filtrar eventos:", error);
      });
  });
}