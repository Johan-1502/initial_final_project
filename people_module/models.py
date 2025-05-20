from django.db import models
from django.core.validators import (
    RegexValidator, MinLengthValidator, MaxLengthValidator, EmailValidator
)

class Person(models.Model):
    name = models.CharField(max_length=200, blank=False)
    dni = models.CharField(max_length=20, primary_key=True, blank=False)
    phoneNumber = models.CharField(max_length=15, blank=False)
    address = models.CharField(max_length=100, blank=False)
    email = models.EmailField(blank=False)
    isVisible = models.BooleanField(default=True)

    def __str__(self):
        return self.name + " " + self.dni

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

class Role(models.Model):
    name = models.CharField(max_length=100, validators=[name_validator])
    description = models.TextField(validators=[MinLengthValidator(10)])

    def __str__(self):
        return self.name
