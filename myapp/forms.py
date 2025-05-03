from django import forms

class InputPersonData(forms.Form):
    name = forms.CharField(label="Nombre",max_length=200)
    dni = forms.IntegerField(label="Identificación")
    phoneNumber = forms.IntegerField(label="Número de teléfono")
    address = forms.CharField(label="Dirección",max_length=100)
    email = forms.EmailField(label="Correo electrónico")

class SearchPerson(forms.Form):
    dni = forms.IntegerField(label="DNI de la persona")