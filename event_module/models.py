from django.db import models
from django.core.validators import (
    RegexValidator, MinLengthValidator, MaxLengthValidator, EmailValidator
)

name_validator = RegexValidator(
    regex=r'^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$',
    message='El nombre solo puede contener letras y espacios.'
)

dni_validator = RegexValidator(
    regex=r'^\d{8,20}$',
    message='El DNI debe contener entre 8 y 20 dígitos numéricos.'
)

phone_validator = RegexValidator(
    regex=r'^\+?\d{7,15}$',
    message='El número debe contener entre 7 y 15 dígitos, puede incluir un + al inicio.'
)

# MODELOS

class Place(models.Model):
    city = models.CharField(max_length=100, validators=[name_validator])
    address = models.CharField(max_length=200, blank=False)
    name = models.CharField(max_length=100, validators=[name_validator])

    def __str__(self):
        return f"{self.name}, {self.city}, {self.address}"


class TypeEvent(models.Model):
    type = models.CharField(max_length=100, validators=[name_validator])

    def __str__(self):
        return self.type


class Event(models.Model):
    name = models.CharField(max_length=100, validators=[MinLengthValidator(3)])
    startDate = models.DateField()
    endDate = models.DateField()
    place = models.ForeignKey(Place, on_delete=models.CASCADE)
    typeEvent = models.ForeignKey(TypeEvent, on_delete=models.CASCADE)
    client = models.ForeignKey('people_module.Person', on_delete=models.CASCADE, related_name="events")
    isVisible = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.startDate} - {self.endDate}) en {self.place.name}, {self.place.city}"

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.endDate < self.startDate:
            raise ValidationError("La fecha de finalización no puede ser anterior a la fecha de inicio.")

class WorkersByEvent(models.Model):
    role = models.ForeignKey('people_module.Role', on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    person = models.ForeignKey('people_module.Person', on_delete=models.CASCADE, related_name="roles")
    salary = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.role.name} en {self.event.name} por {self.person.name}"