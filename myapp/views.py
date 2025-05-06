from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .forms import InputPersonData, SearchPerson
from . import services

# Create your views here.


def index(request):
    return render(request, "index.html")


def create_person(request):
    if request.method == "GET":
        return render(request, "create-people.html", {"form": InputPersonData()})
    else:
        services.createPerson(request)
        people = services.getAllPeople()
        return render(request, "show_people.html", {"people": people})


def search_person(request):
    if request.method == "GET":
        return render(request, "search_person.html", {"form": SearchPerson()})
    else:
        people = services.searchPerson(request.POST["dni"])
        return render(request, "details_person.html", {"people": people})


def show_people(request):
    people = services.getAllPeople()
    return render(request, "people.html", {"people": people})


def delete_person(request, id):
    services.deletePerson(id)
    people = services.getAllPeople()
    return render(request, "show_people.html", {"people": people})


def edit_person(request):
    if request.method == "GET":
        people = services.getAllPeople()  # Obtiene todas las personas
        return render(request, "edite-people.html", {"people": people})


def get_person(request, dni):
    try:
        person = services.getPersonById(dni)  # Obtiene la persona por DNI
        data = {
            "name": person.name,
            "dni": person.dni,
            "phoneNumber": person.phoneNumber,
            "address": person.address,
            "email": person.email,
        }
        return JsonResponse(data)
    except Person.DoesNotExist:
        return JsonResponse({"error": "Persona no encontrada"}, status=404)


def confirm_changes(request):
    services.editPerson(request)
    people = services.searchPerson(request.POST["dni"])
    return render(request, "details_person.html", {"people": people})
