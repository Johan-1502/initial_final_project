from .models import Person
from .models import Event
from .models import Place
from .models import TypeEvent
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


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

def createEvent(request):
    try:
        event = Event.objects.create(
            name = request.POST["name"],
            startDate = request.POST["startDate"],
            endDate = request.POST["endDate"],
            place = Place.objects.get(id=request.POST["place"]),
            typeEvent = TypeEvent.objects.get(id=request.POST["typeEvent"]),
            client = Person.objects.get(dni=request.POST["client"]),
        )
        event.full_clean()
        event.save()
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


def getallPlaces():
    return Place.objects.all()


def getallTypes():
    return TypeEvent.objects.all()


def getAllEvents():
    return Event.objects.filter(isVisible=True)


def deletePerson(dni):
    persons = Person.objects.filter(dni=dni)
    for person in persons:
        person.isVisible = False
        person.save()


def deleteEvent(id):
    events = Event.objects.filter(id=id)
    for event in events:
        event.isVisible = False
        event.save()


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


def editEvent(request):
    try:
        event = Event.objects.get(id=request.POST["id"])
        event.name = request.POST["name"]
        event.startDate = request.POST["startDate"]
        event.endDate = request.POST["endDate"]
        event.place = Place.objects.get(id=request.POST["place"])
        event.typeEvent = TypeEvent.objects.get(id=request.POST["typeEvent"])
        event.full_clean()
        event.save()
    except ValidationError as v:
        raise v
    except KeyError as k:
        raise k
    except Exception as e:
        raise e


def filter_people_by(**kwargs):
    return Person.objects.filter(**kwargs)


def filter_event_by(**kwargs):
    print("función filter_event_by")
    return Event.objects.filter(**kwargs)


def getPersonById(dni):
    try:
        return Person.objects.get(dni=dni)
    except Person.DoesNotExist:
        raise Person.DoesNotExist(f"No se encontró una persona con el DNI {dni}")

def getEventById(id):
    try:
        return Event.objects.get(id=id)
    except Person.DoesNotExist:
        raise Person.DoesNotExist(f"No se encontró un evento con el id {id}")
