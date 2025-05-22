export function setupEventSearch(resultsList, searchInput) {
  searchInput.addEventListener('keyup', function (event) {
    handleEventSearch(searchInput, resultsList);
  });
}

function handleEventSearch(searchInput, resultsList) {
  const query = searchInput.value.trim();
  fetchEvents(query, resultsList);
}

function fetchEvents(query, resultsList) {
  fetch(`/manage_event/filter-events/?query=${query}`)
    .then(response => response.json())
    .then(data => {
      populateEventsList(data, resultsList);
    })
    .catch(error => {
      console.error("Error al filtrar eventos:", error);
    });
}

function populateEventsList(data, resultsList) {
  resultsList.innerHTML = "";
  data.events.forEach(event => {
    const eventListItem = createEventListItem(event);
    resultsList.appendChild(eventListItem);
  });
}

function createEventListItem(event) {
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
  return li;
}

export function setupPeopleSearch(rootContainer, prefix) {
  const searchPersonInput = rootContainer.querySelector('.searchPersonInput');
  const resultPersonList = rootContainer.querySelector('.resultPersonList');
  
  searchPersonInput.addEventListener('keyup', function (event) {
    handlePeopleSearch(searchPersonInput, resultPersonList, prefix);
  });
}

function handlePeopleSearch(searchPersonInput, resultPersonList, prefix) {
  const query = searchPersonInput.value.trim();
  fetchPeople(query, resultPersonList, prefix);
}

function fetchPeople(query, resultPersonList, prefix) {
  fetch(`/filter-people/?query=${query}`)
    .then(response => response.json())
    .then(data => {
      populatePeopleList(data, resultPersonList, prefix);
    })
    .catch(error => {
      console.error("Error al filtrar personas:", error);
    });
}

function populatePeopleList(data, resultPersonList, prefix) {
  resultPersonList.innerHTML = "";
  const isClient = determineIfClient(prefix);
  
  data.people.forEach(person => {
    const personListItem = createPersonListItem(person, isClient);
    resultPersonList.appendChild(personListItem);
  });
}

function determineIfClient(prefix) {
  return (prefix === 'edit-client' || prefix === 'create-client');
}

function createPersonListItem(person, isClient) {
  const li = document.createElement("li");
  li.className = "list-group-item d-flex justify-content-between align-items-center";
  li.innerHTML = `
    <span>${person.dni} - ${person.name}</span>
    <button class="btn btn-sm btn-outline-primary view-button"
            onclick="addEmployeeToSelectedList(this, ${isClient})"
            data-dni="${person.dni}"
            data-name="${person.name}"
            data-phone="${person.phoneNumber}"
            data-address="${person.address}"
            data-email="${person.email}">
      Seleccionar
    </button>
  `;
  return li;
}