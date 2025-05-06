from django import forms
from .models import Person

class InputPersonData(forms.Form):
    name = forms.CharField(
        label="Nombre",
        max_length=200,
        widget=forms.TextInput(attrs={
            "class": "form-control",
            "style": "height: 4em;",
            "placeholder": "Ingrese el nombre completo"
        })
    )
    dni = forms.IntegerField(
        label="Identificación",
        widget=forms.NumberInput(attrs={
            "class": "form-control",
            "style": "height: 4em;",
            "placeholder": "Ingrese el número de identificación"
        })
    )
    phoneNumber = forms.IntegerField(
        label="Número de teléfono",
        widget=forms.NumberInput(attrs={
            "class": "form-control",
            "style": "height: 4em;",
            "placeholder": "Ingrese el número de teléfono"
        })
    )
    address = forms.CharField(
        label="Dirección",
        max_length=100,
        widget=forms.TextInput(attrs={
            "class": "form-control",
            "style": "height: 4em;",
            "placeholder": "Ingrese la dirección"
        })
    )
    email = forms.EmailField(
        label="Correo electrónico",
        widget=forms.EmailInput(attrs={
            "class": "form-control",
            "style": "height: 4em;",
            "placeholder": "Ingrese el correo electrónico"
        })
    )

class SearchPerson(forms.Form):
    dni = forms.IntegerField(label="DNI de la persona")

class UpdatePersonForm(forms.ModelForm):
    class Meta:
        model = Person
        fields = ["dni", "name", "phoneNumber", "address", "email"]
        widgets = {
            "dni": forms.TextInput(attrs={"readonly": "readonly", "class": "form-control mb-2"}),
            "name": forms.TextInput(attrs={"class": "form-control mb-2"}),
            "phoneNumber": forms.TextInput(attrs={"class": "form-control mb-2"}),
            "address": forms.TextInput(attrs={"class": "form-control mb-2"}),
            "email": forms.EmailInput(attrs={"class": "form-control mb-2"}),
        }