export let selectedEventName = null;

export function showDetails(button, detailElementsChange, searchContainer, detailContainer, buttonContainer) {
  console.log(button.getAttribute("data-date"));
  
  const event = {
    name: button.getAttribute('data-name'),
    startDate: button.getAttribute('data-start-date'),
    endDate: button.getAttribute('data-end-date'),
    place: button.getAttribute('data-place'),
    type: button.getAttribute('data-type'),
    placeId: button.getAttribute('data-place-id'),
    typeId: button.getAttribute('data-type-id'),
    id: button.getAttribute('data-id'),
    client: button.getAttribute('data-client'),
  };

  if (window.selectedEventName == event.name) {
    searchContainer.classList.remove('col-md-6');
    searchContainer.classList.add('col-md-12');
    detailContainer.classList.remove('opacity-100');
    detailContainer.classList.add('opacity-0');
    buttonContainer.classList.add('opacity-100');
    buttonContainer.classList.remove('opacity-0');
    document.querySelector('.edit-delete-event-section').classList.add('d-none');
    document.querySelector('.create-event-section').classList.add('d-none');
    window.selectedEventName = null;
  } else {
    window.selectedEventName = event.name;

    detailElementsChange.nombre.value = event.name;
    detailElementsChange.fechaInicio.value = event.startDate;
    detailElementsChange.fechaFin.value = event.endDate;
    detailElementsChange.id.value = event.id;
    // Limpia los selects antes de agregar la opción actual
    detailElementsChange.client.innerHTML = "";
    detailElementsChange.selectPlace.innerHTML = "";
    detailElementsChange.selectType.innerHTML = "";
    const place = document.createElement("option");
    place.value = event.placeId;
    place.textContent = event.place;
    detailElementsChange.selectPlace.appendChild(place);

    const type = document.createElement("option");
    type.value = event.typeId;
    type.textContent = event.type;
    detailElementsChange.selectType.appendChild(type);

    fetch(`/manage_event/places/`)
      .then(response => response.json())
      .then(data => {
        data.places.forEach(place => {
          if (!(place.name == event.place)) {
            const option = document.createElement("option");
            option.value = place.id;
            option.textContent = place.name;
            detailElementsChange.selectPlace.appendChild(option);
          }
        });
      })
      .catch(error => {
        console.error("Error al filtrar eventos:", error);
      });

    fetch(`/manage_event/types/`)
      .then(response => response.json())
      .then(data => {
        data.types.forEach(type => {
          if (!(type.name == event.type)) {
            const option = document.createElement("option");
            option.value = type.id;
            option.textContent = type.name;
            detailElementsChange.selectType.appendChild(option);
          }
        });
      })
      .catch(error => {
        console.error("Error al filtrar eventos:", error);
      });

    // Limpia el select antes de agregar las opciones
    detailElementsChange.client.innerHTML = "";

    // Llenar el select con todas las personas registradas
    fetch('/manage_event/people/')
      .then(response => response.json())
      .then(data => {
        data.people.forEach(person => {
          const option = document.createElement("option");
          option.value = person.id;
          option.textContent = person.name;
          // Si es el cliente actual del evento, márcalo como seleccionado
          if (String(person.id) === String(event.client)) {
            option.selected = true;
          }
          detailElementsChange.client.appendChild(option);
        });
      })
      .catch(error => {
        console.error("Error al cargar personas:", error);
      });


    searchContainer.classList.remove('col-md-12');
    searchContainer.classList.add('col-md-6');
    detailContainer.classList.remove('opacity-0');
    detailContainer.classList.add('opacity-100');
    buttonContainer.classList.add('opacity-100');
    buttonContainer.classList.remove('opacity-0');
    document.querySelector('.create-event-section').classList.add('d-none');
    document.querySelector('.edit-delete-event-section').classList.remove('d-none');
  }

}

export function addEmployeeToSelectedList(button) {
  // Obtén los datos del botón
  const dni = button.getAttribute('data-dni');
  const name = button.getAttribute('data-name');
  const searchPeopleContainer = document.getElementById("search-people-container");
  const desactivatePeopleCreateButton = document.getElementById("desactivatePeopleCreateButton");
  const activatePeopleCreateButton = document.getElementById("activatePeopleCreateButton");
  desactivatePeopleCreateButton.classList.add("d-none");
  activatePeopleCreateButton.classList.remove("d-none");
  const ul = document.getElementById('selected-employees-list');
  const exists = Array.from(ul.querySelectorAll('li span')).some(span => {
    return span.textContent.startsWith(`${dni} -`);
  });
  if (exists) {
    document.querySelector('.selected_employees_list').classList.remove('d-none');
    document.querySelector('.selected_employees_list').classList.add('col-md-6');
    const searchPeopleContainer = document.getElementById("search-people-container");
    searchPeopleContainer.classList.add('col-md-6');
    searchPeopleContainer.classList.remove('col-md-12');
    document.querySelector('.create-person-section').classList.add('d-none');
    alert('Esta persona ya ha sido añadida.');
    return;
  }

  

  // Crea el elemento li
  const li = document.createElement('li');
  li.className = 'selected-employees list-group-item d-flex justify-content-between align-items-center';

  // Crea el span con los datos
  const span = document.createElement('span');
  span.textContent = `${dni} - ${name}`;

  // Crea el select vacío
  const select = document.createElement('select');
  select.name = "typeEvent";
  select.className = "little-form mb-2";

  // Llenar el select automáticamente con los roles
  fetch('/manage_event/roles/')
    .then(response => response.json())
    .then(data => {
      data.roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.id;
        option.textContent = role.name;
        select.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Error al cargar roles:", error);
    });
  
  
  // Botón para eliminar persona de la lista
  const deleteBtn = document.createElement('button');
  deleteBtn.type = "button";
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = `<i class="fa-solid fa-xmark fa-beat"></i>`;
  deleteBtn.onclick = function() {
    li.remove();
    searchWidthAdjust();
  };

  // Contenedor para select y botón
  const div = document.createElement('div');
  div.className = "d-flex align-items-center";
  div.appendChild(select);
  div.appendChild(deleteBtn);

  // Agrega los elementos al li
  li.appendChild(span);
  li.appendChild(div);

  

  // Añade el li al ul
  document.getElementById('selected-employees-list').appendChild(li);
  searchWidthAdjust();
}

function searchWidthAdjust() {
  const searchPeopleContainer = document.getElementById("search-people-container");
  const ul = document.getElementById('selected-employees-list');
  const items = ul.querySelectorAll('li').length;
  searchPeopleContainer.classList.remove('col-md-6', 'col-md-12');
  if (items > 0) {
    searchPeopleContainer.classList.add('col-md-6');
    document.querySelector('.selected_employees_list').classList.remove('d-none');
    document.querySelector('.selected_employees_list').classList.add('col-md-6');
    document.querySelector('.create-person-section').classList.add('d-none');

  } else {
    searchPeopleContainer.classList.add('col-md-12');
    document.querySelector('.selected_employees_list').classList.add('d-none');
    document.querySelector('.selected_employees_list').classList.remove('col-md-6');
  }
}

// Llenar el select con roles desde la base de datos
function mostrarRoles(button) {
  const select = button.parentElement.querySelector('select');
  fetch('manage_event/roles/') // Cambia por tu endpoint real
    .then(response => response.json())
    .then(data => {
      select.innerHTML = '';
      data.roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.id;
        option.textContent = role.nombre;
        select.appendChild(option);
      });
      select.focus();
    });
}

// Eliminar persona de la lista
function eliminarPersonaDeLista(button) {
  const li = button.closest('li');
  if (li) li.remove();
  console.log("Eliminando, ajustando ancho...");
  searchWidthAdjust();
}

// ...definición de eliminarPersonaDeLista...
window.eliminarPersonaDeLista = eliminarPersonaDeLista;

// ...definición de mostrarRoles...
window.mostrarRoles = mostrarRoles;

window.addEmployeeToSelectedList = addEmployeeToSelectedList;

window.showEventDetails = function (button) {
  const { detailElementsChange, searchContainer, detailContainer, buttonContainer } = window.eventGlobals;
  showDetails(button, detailElementsChange, searchContainer, detailContainer, buttonContainer);
};

