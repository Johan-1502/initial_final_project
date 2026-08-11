from .models import Event
from .models import Place
from .models import TypeEvent
from .models import WorkersByEvent
from people_module.models import Person
from people_module.models import Role
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


def createEvent(request):
    print(request.POST["name"])
    print(request.POST["startDate"])
    print(request.POST["endDate"])
    print(request.POST["place"])
    print(request.POST["typeEvent"])
    print(request.POST["client"])

    employees_json = request.POST.get("employees")
    employees = json.loads(employees_json)
    try:
        typeToPut= ""
        if(request.POST["typeWritten"] == ""):
            typeToPut = TypeEvent.objects.get(id=request.POST["typeEvent"])
        else:
            type_name = request.POST["typeWritten"]
            type_event = TypeEvent.objects.filter(type=type_name).first()
            if type_event:
                typeToPut = type_event
            else:
                typeToPut = TypeEvent.objects.create(type=request.POST["typeWritten"])
        event = Event.objects.create(
            name=request.POST["name"],
            startDate=request.POST["startDate"],
            endDate=request.POST["endDate"],
            place=Place.objects.get(id=request.POST["place"]),
            typeEvent=typeToPut,
            client=Person.objects.get(dni=request.POST["client"]),
        )
        event.full_clean()
        event.save()

        if employees_json:
            for employee in employees:
                try:
                    person = Person.objects.get(dni=employee["dni"])
                    role = Role.objects.get(id=employee["role"])
                    WorkersByEvent.objects.create(event=event, person=person, role=role)
                except Person.DoesNotExist:
                    continue
    except ValidationError as v:
        raise v
    except IntegrityError as i:
        raise i
    except KeyError as k:
        raise k
    except Exception as e:
        raise e


def getallPlaces():
    return Place.objects.all()


def getallTypes():
    return TypeEvent.objects.all()


def getAllEvents():
    return Event.objects.filter(isVisible=True)


def deleteEvent(id):
    events = Event.objects.filter(id=id)
    for event in events:
        event.isVisible = False
        event.save()


def editEvent(request):
    employees_json = request.POST.get("employees")
    employees = json.loads(employees_json)
    try:
        event = Event.objects.get(id=request.POST["id"])
        event.name = request.POST["name"]
        event.startDate = request.POST["startDate"]
        event.endDate = request.POST["endDate"]
        event.place = Place.objects.get(id=request.POST["place"])
        if(request.POST["typeWritten"] == ""):
            event.typeEvent = TypeEvent.objects.get(id=request.POST["typeEvent"])
        else:
            type_name = request.POST["typeWritten"]
            type_event = TypeEvent.objects.filter(type=type_name).first()
            if type_event:
                event.typeEvent = type_event
            else:
                event.typeEvent = TypeEvent.objects.create(type=request.POST["typeWritten"])
        event.client = Person.objects.get(dni=request.POST["client"])
        event.full_clean()
        event.save()

        WorkersByEvent.objects.filter(event=event).delete()

        if employees_json:
            for employee in employees:
                try:
                    person = Person.objects.get(dni=employee["dni"])
                    role_value = employee["role"]
                    if isinstance(role_value, int) or (isinstance(role_value, str) and role_value.isdigit()):
                        role = Role.objects.get(id=role_value)
                    else:
                        role = Role.objects.create(name=role_value, description="")
                    salary = employee["salary"]
                    WorkersByEvent.objects.create(
                        event=event, person=person, role=role, salary=salary
                    )
                except Person.DoesNotExist:
                    continue
    except ValidationError as v:
        raise v
    except KeyError as k:
        raise k
    except Exception as e:
        raise e


def filter_event_by(**kwargs):
    print("función filter_event_by")
    return Event.objects.filter(**kwargs)


def getEventById(id):
    try:
        return Event.objects.get(id=id)
    except Person.DoesNotExist:
        raise Person.DoesNotExist(f"No se encontró un evento con el id {id}")


def getEmployeesByEvent(id):
    print("función getEmployeesByEvent")
    print(id)
    try:
        event = Event.objects.get(id=id)
        employees = WorkersByEvent.objects.filter(event=event)
        return employees
    except Event.DoesNotExist:
        raise Event.DoesNotExist(f"No se encontró un evento con el id {id}")


def getEmployeesDataByEvent(id):
    try:
        event = Event.objects.get(id=id)
        workers = WorkersByEvent.objects.filter(event=event)
        employees_data = []
        for worker in workers:
            employees_data.append(
                {
                    "id": str(worker.person.dni),
                    "name": str(worker.person.name),
                    "salary": str(worker.salary),
                    "role": str(worker.role.name),
                }
            )
        return employees_data
    except Event.DoesNotExist:
        return []


def createPlace(request):
    place = Place.objects.create(
        city=request.POST["city"],
        address=request.POST["direction"],
        name=request.POST["placeName"],
    )
    place.save()
    return place
