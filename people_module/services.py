from .models import Person, Role
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from event_module.models import WorkersByEvent


def createPerson(request):
    try:
        person = Person.objects.create(
            name=request.POST["name"],
            dni=request.POST["dni"],
            phoneNumber=request.POST["phoneNumber"],
            address=request.POST["address"],
            email=request.POST["email"],
        )
        person.full_clean()
        person.save()
    except ValidationError as v:
        raise v
    except IntegrityError as i:
        raise i
    except KeyError as k:
        raise k
    except Exception as e:
        raise e


def getAllPeople():
    return Person.objects.filter(isVisible=True)


def deletePerson(dni):
    persons = Person.objects.filter(dni=dni)
    for person in persons:
        person.isVisible = False
        person.save()


def editPerson(request):
    try:
        person = Person.objects.get(dni=request.POST["dni"])
        person.name = request.POST["name"]
        person.phoneNumber = request.POST["phoneNumber"]
        person.address = request.POST["address"]
        person.email = request.POST["email"]
        person.full_clean()
        person.save()
    except ValidationError as v:
        raise v
    except KeyError as k:
        raise k
    except Exception as e:
        raise e


def filter_people_by(**kwargs):
    return Person.objects.filter(**kwargs)

def getAllRoles():
    return Role.objects.all()

def getPersonById(dni):
    try:
        return Person.objects.get(dni=dni)
    except Person.DoesNotExist:
        raise Person.DoesNotExist(f"No se encontró una persona con el DNI {dni}")

def getEventHistoryByPerson(dni):
    try:
        person = Person.objects.get(dni=dni)
        workers = WorkersByEvent.objects.filter(person=person)
        history = []
        for worker in workers:
            history.append({
                "Nombre del evento": worker.event.name,
                "Fecha de inicio": worker.event.startDate.strftime('%Y/%m/%d') if worker.event.startDate else "",
                "Fecha de finalización": worker.event.endDate.strftime('%Y/%m/%d') if worker.event.endDate else "",
                "Salario": str(worker.salary),
                "Rol": worker.role.name,
            })
        return history
    except Person.DoesNotExist:
        return []