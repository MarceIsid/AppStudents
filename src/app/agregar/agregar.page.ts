import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApicrudService } from '../services/apicrud.service';
import { Asignatura } from 'src/interfaces/Asignaturas';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage {

  // Modelo para la nueva asignatura
  nuevaAsignatura: Asignatura = {
    id: 0,  // El id lo puede generar el backend (si es autogenerado) o se puede generar en el frontend
    name: '',
    description: '',
    image: '',
    professor: '',
    date: '',
  };

  constructor(private router: Router, private apicrudService: ApicrudService) {}

  // Función para manejar el envío del formulario
  onSubmit() {
    // Validar que todos los campos estén completos
    if (this.isFormValid()) {
      // Llamar al servicio para agregar la nueva asignatura
      this.apicrudService.postAsignaturas(this.nuevaAsignatura).subscribe(
        response => {
          // Si la asignatura se agregó correctamente, redirigir al usuario
          console.log('Asignatura agregada correctamente', response);
          this.router.navigate(['/home']);  // Redirigir a la página principal
        },
        error => {
          // Si ocurre un error, mostrarlo en consola o manejarlo según corresponda
          console.error('Error al agregar la asignatura', error);
          alert('Hubo un error al agregar la asignatura. Intenta nuevamente.');
        }
      );
    } else {
      alert('Por favor, complete todos los campos.');
    }
  }

  // Validar que todos los campos estén completos
  isFormValid() {
    return this.nuevaAsignatura.name && this.nuevaAsignatura.description && this.nuevaAsignatura.image && this.nuevaAsignatura.professor && this.nuevaAsignatura.date;
  }
}
