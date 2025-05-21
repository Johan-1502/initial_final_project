import { setupSearch } from './search.js';
import { setupCreate } from './create.js';
import { setupUpdate, setupDelete, showMessage } from './update_delete.js';
import { showDetails } from './details.js';


document.addEventListener("DOMContentLoaded", () => {
  const message = sessionStorage.getItem("successMessage");
  if (message) {
    showMessage(message, "success");
    sessionStorage.removeItem("successMessage");
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const resultsList = document.getElementById('resultsList');
  const resultPersonList = document.getElementById('resultPersonList');
  const searchInput = document.getElementById('searchInput');
  const searchPersonInput = document.getElementById('searchPersonInput');
  const updateButton = document.getElementById('update-button');
  const changeForm = document.getElementById('changeForm');
  const activateCreateButton = document.getElementById("activateEventCreateButton");
  const activatePeopleCreateButton = document.getElementById("activatePeopleCreateButton");
  const buttonContainer = document.getElementById("event-button-container");
  const searchContainer = document.getElementById("search-container");
  const desactivatePeopleCreateButton = document.getElementById("desactivatePeopleCreateButton");
  const detailContainer = document.getElementById("detail-container");
  const deleteButton = document.getElementById("delete-button");
  const selectEmployeeButtons = document.querySelectorAll('.pop-up-detail-employees');
  const popUp = document.getElementById("pop-up-main");
  const closePopUp = document.getElementById("close-pop-up");

  const detailElementsCreate = {
    nombre: document.getElementById('create-detail-nombre'),
    idLabel: document.getElementById('create-label-id'),
    fechaInicio: document.getElementById('create-detail-fecha-inicio'),
    fechaFin: document.getElementById('create-detail-fecha-fin'),
    id: document.getElementById('create-detail-id'),
    client: document.getElementById('create-detail-client'),
    selectPlace: document.getElementById('create-selectPlace'),
    selectType: document.getElementById('create-selectType'),
  };

  const detailPersonElementsCreate = {
    cc: document.getElementById('create-detail-cc'),
    nombre: document.getElementById('create-detail-nombre'),
    telefono: document.getElementById('create-detail-telefono'),
    direccion: document.getElementById('create-detail-direccion'),
    correo: document.getElementById('create-detail-correo'),
  };

  console.log('idLabel', detailElementsCreate.idLabel)
  
  const detailElementsChange = {
    nombre: document.getElementById('change-detail-nombre'),
    fechaInicio: document.getElementById('change-detail-fecha-inicio'),
    fechaFin: document.getElementById('change-detail-fecha-fin'),
    id: document.getElementById('change-detail-id'),
    client: document.getElementById('change-detail-client'),
    selectPlace: document.getElementById('change-selectPlace'),
    selectType: document.getElementById('change-selectType'),
  };

  window.showEventDetails = (button) => {
    console.log("Datos:"+button.getAttribute("data-name"));
    showDetails(
      button,
      detailElementsChange,
      searchContainer,
      detailContainer,
      buttonContainer
    );
  };
  closePopUp.addEventListener('click', () => {
    popUp.classList.add("d-none");
  });
  selectEmployeeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      popUp.classList.remove("d-none");
    });
  });

  const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

  setupSearch(resultsList, searchInput, searchPersonInput, resultPersonList);
  setupCreate(activateCreateButton, desactivatePeopleCreateButton, detailElementsCreate, searchContainer, buttonContainer, detailContainer, activatePeopleCreateButton, detailPersonElementsCreate, resultPersonList);
  setupUpdate(updateButton, changeForm, detailElementsChange, csrfToken);
  setupDelete(deleteButton, changeForm, csrfToken);
});