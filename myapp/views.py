from django.shortcuts import render
from django.http import HttpResponse
from .forms import InputPersonData, SearchPerson
from . import services

# Create your views here.


def index(request):
    return render(request, "index.html")


def create_person(request):
    if request.method == "GET":
        return render(request, "create_person.html", {"form": InputPersonData()})
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
    return render(request, "show_people.html", {"people": people})


def delete_person(request):
    if request.method == "GET":
        return render(request, "delete_person.html", {"form": SearchPerson()})
    else:
        services.deletePerson(request.POST["dni"])
        people = services.getAllPeople()
        return render(request, "show_people.html", {"people": people})


def edit_person(request):
    if request.method == "GET":
        return render(request, "edit_person.html", {"form": SearchPerson()})
    else:
        people = services.searchPerson(request.POST["dni"])

        person = people.first()

        return render(
            request,
            "modify_person.html",
            {
                "form": InputPersonData(
                    initial={
                        "name": person.name,
                        "dni": person.dni,
                        "phoneNumber": person.phoneNumber,
                        "address": person.address,
                        "email": person.email,
                    }
                )
            },
        )


def confirm_changes(request):
    services.editPerson(request)
    people = services.searchPerson(request.POST["dni"])
    return render(request, "details_person.html", {"people": people})
