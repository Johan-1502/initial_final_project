export function setupSearch(resultsList, searchInput, searchPersonInput, resultPersonList) {
  searchInput.addEventListener('keyup', function (event) {
    const query = searchInput.value.trim();
    fetch(`/manage_event/filter-events/?query=${query}`)
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
  searchPersonInput.addEventListener('keyup', function (event) {
    const query = searchPersonInput.value.trim();
    fetch(`/filter-people/?query=${query}`)
      .then(response => response.json())
      .then(data => {
        resultPersonList.innerHTML = "";
        data.people.forEach(person => {
          const li = document.createElement("li");
          li.className = "list-group-item d-flex justify-content-between align-items-center";
          li.innerHTML = `
            <span>${person.dni} - ${person.name}</span>
            <button class="btn btn-sm btn-outline-primary view-button"
                    onclick="addEmployeeToSelectedList(this)"
                    data-dni="${person.dni}"
                    data-name="${person.name}"
                    data-phone="${person.phoneNumber}"
                    data-address="${person.address}"
                    data-email="${person.email}">
              Añadir
            </button>
          `;
          resultPersonList.appendChild(li);
        });
      })
      .catch(error => {
        console.error("Error al filtrar personas:", error);
      });
  });
}