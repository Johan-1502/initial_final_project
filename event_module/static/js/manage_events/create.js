
  export function setupCreate(activateCreateButton, detailElementsCreate, searchContainer, buttonContainer, detailContainer, activatePeopleCreateButton, detailPersonElementsCreate, resultPersonList) {
    activateCreateButton.addEventListener('click', function () {
      document.querySelector('.edit-delete-person-section').classList.add('d-none');
      document.querySelector('.create-event-section').classList.remove('d-none');
      detailElementsCreate.selectPlace.innerHTML = "";
      detailElementsCreate.selectType.innerHTML = "";
      detailElementsCreate.client.removeAttribute('style');

      detailElementsCreate.nombre.value = "";
      detailElementsCreate.id.style.display = 'none';
      detailElementsCreate.idLabel.style.display = 'none';
      searchContainer.classList.add('col-md-6');
      buttonContainer.classList.add('opacity-0');
      buttonContainer.classList.remove('opacity-100');
      window.selectedEventName = null;
      detailElementsCreate.id.value = "";
      

      fetch(`/manage_event/`)
        .then(response => response.json())
        .then(data => {
          data.people.forEach(person => {
            console.log(person);
            const option = document.createElement("option");
            option.value = person.dni;
            option.textContent = person.name;
            detailElementsCreate.client.appendChild(option);
          });
        })
        .catch(error => {
          console.error("Error al filtrar eventos:", error);
        });

      fetch(`/manage_event/places/`)
        .then(response => response.json())
        .then(data => {
          data.places.forEach(place => {
            const option = document.createElement("option");
            option.value = place.id;
            option.textContent = place.name;
            detailElementsCreate.selectPlace.appendChild(option);
          });
        })
        .catch(error => {
          console.error("Error al filtrar eventos:", error);
        });

      fetch(`/manage_event/types/`)
        .then(response => response.json())
        .then(data => {
          data.types.forEach(type => {
            const option = document.createElement("option");
            option.value = type.id;
            option.textContent = type.name;
            detailElementsCreate.selectType.appendChild(option);
          });
        })
        .catch(error => {
          console.error("Error al filtrar eventos:", error);
        });

      // Limpia el select antes de agregar las opciones
      detailElementsCreate.client.innerHTML = "";

      // Llenar el select con todas las personas registradas
      fetch('/manage_event/people/')
        .then(response => response.json())
        .then(data => {
          data.people.forEach(person => {
            const option = document.createElement("option");
            option.value = person.id; // Usa .id si tu endpoint lo devuelve, o .dni si solo tienes dni
            option.textContent = person.name;
            detailElementsCreate.client.appendChild(option);
          });
        })
        .catch(error => {
          console.error("Error al cargar personas:", error);
        });


      searchContainer.classList.remove('col-md-12');
      searchContainer.classList.add('col-md-6');
      buttonContainer.classList.add('opacity-0');
      buttonContainer.classList.remove('opacity-100');
      detailContainer.classList.remove('opacity-0');
      detailContainer.classList.add('opacity-100');
      
    });
    activatePeopleCreateButton.addEventListener('click', function() {
      document.querySelector('.selected_employees_list').classList.add('d-none');
      document.querySelector('.create-person-section').classList.remove('d-none');
      document.querySelector('.create-person-section').classList.add('col-md-6');
      detailPersonElementsCreate.cc.readOnly = false;
      detailPersonElementsCreate.cc.value = "";
      detailPersonElementsCreate.nombre.value = "";
      detailPersonElementsCreate.telefono.value = "";
      detailPersonElementsCreate.direccion.value = "";
      detailPersonElementsCreate.correo.value = "";
      activatePeopleCreateButton.classList.remove("opacity-100");
      activatePeopleCreateButton.classList.add("opacity-0");
      
      const searchPeopleContainer = document.getElementById("search-people-container");
      searchPeopleContainer.classList.remove('col-md-12');
      searchPeopleContainer.classList.add('col-md-6');
      detailContainer.classList.remove('opacity-0');
      detailContainer.classList.add('opacity-100');
      window.selectedPersonDni = null;
    });
    const formPersona = document.getElementById('createPersonForm');
    if (formPersona) {
      formPersona.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(formPersona);
        formData.append('form_type', 'create_person');

        fetch('add_employee/', {
          method: 'POST',
          body: formData,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': getCookie('csrftoken') // Si usas CSRF
          }
        })
        .then(response => response.json())
        // Dentro del .then(data => { ... }) después de crear la persona:
  .then(data => {
    alert("Se creo la persona con exito");
    if (data.success) {
      formPersona.reset();

      const newPersonId = data.new_person_id;

      // Vuelve a llenar el select de clientes
      detailElementsCreate.client.innerHTML = "";
      fetch('/manage_event/people/')
        .then(response => response.json())
        .then(dataPeople => {
          dataPeople.people.forEach(person => {
            const option = document.createElement("option");
            option.value = person.id;
            option.textContent = person.name;
            if (String(person.id) === String(newPersonId)) {
              option.selected = true;
            }
            detailElementsCreate.client.appendChild(option);
          });
        });

      // Actualiza la lista de personas disponibles
      fetch(`/filter-people/?query=`)
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
    }
  })

      });
  }

  // Utilidad para obtener el CSRF token de la cookie
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  }