import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApicrudService } from '../services/apicrud.service';
import { Asignatura } from 'src/interfaces/Asignaturas';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.page.html',
  styleUrls: ['./generate.page.scss'],
})
export class GeneratePage implements OnInit {

  asignaturas: Asignatura[] = [];  // Lista de asignaturas
  id: any;
  qrdata: string = '';  // Para el código QR
  nombre: string | null;
  asignatura: Asignatura = {
    id: 0,
    name: '',
    description: '',
    image: '',
    professor: '',
    date: ''
  };

  constructor(
    private activated: ActivatedRoute,
    private router: Router,
    private alertcontroller: AlertController,
    private apicrud: ApicrudService
  ) {
    // Recibir los parámetros enviados en la navegación
    this.activated.queryParams.subscribe(param => {
      if (param['asignatura']) {
        this.asignatura = JSON.parse(param['asignatura']);
      }
    });

    // Obtener el nombre del usuario desde el sessionStorage
    this.nombre = sessionStorage.getItem('username');
  }

  ngOnInit() {
    this.id = this.asignatura.id;
    this.loadAsignaturas();  // Cargar las asignaturas desde la API
  }

  // Cargar las asignaturas desde la API
  loadAsignaturas() {
    this.apicrud.getAsignaturas().subscribe(
      (data) => {
        this.asignaturas = data;  // Asignar los datos a la variable
      },
      (error) => {
        console.error('Error al cargar las asignaturas', error);
      }
    );
  }

  // Volver a la página anterior
  volver() {
    this.router.navigate(['/tabs/tab1']);
  }

  // Actualizar asignatura
  actualizarAsignatura(asignatura: Asignatura) {
    this.router.navigate(['/actualizar', asignatura.id], {
      queryParams: { asignatura: JSON.stringify(asignatura) }
    });
  }

  // Generar QR
  generarQr() {
    if (this.asignatura && this.nombre) {
      // Generar el QR con la nueva estructura de la asignatura
      this.qrdata = `Asignatura: ${this.asignatura.name}\nDescripción: ${this.asignatura.description}\nProfesor: ${this.asignatura.professor}\nFecha: ${this.asignatura.date}\nUsuario: ${this.nombre}`;
      console.log(this.qrdata);
    }
  }

  // Confirmar eliminación de asignatura
  async consultaElimina() {
    const alert = await this.alertcontroller.create({
      header: 'Confirmar Eliminación',
      message: '¿Eliminar la asignatura?',
      buttons: [
        {
          text: 'Sí',
          role: 'confirm',
          handler: () => {
            this.elimina();
          },
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.router.navigate(['/tabs/tab1']);
          },
        },
      ],
    });
    await alert.present();
  }

  // Eliminar asignatura
  elimina() {
    this.apicrud.deleteAsignatura(this.asignatura).subscribe(
      (response) => {
        console.log('Asignatura eliminada', response);
        this.mensaje();
      },
      (error) => {
        console.error('Error al eliminar asignatura', error);
        alert('Hubo un error al eliminar la asignatura. Intenta nuevamente.');
      }
    );
  }

  // Mostrar mensaje después de eliminar asignatura
  async mensaje() {
    const alert = await this.alertcontroller.create({
      header: 'Eliminando Asignatura',
      message: 'La asignatura ha sido eliminada.',
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.router.navigate(['/tabs/tab1']);
          },
        },
      ],
    });
    await alert.present();
  }

  // Mostrar mensaje cuando el QR se haya generado
  async mostrarMensaje() {
    const alerta = await this.alertcontroller.create({
      header: 'Generación de QR',
      message: 'El código QR ha sido generado.',
      buttons: ['Ok']
    });
    alerta.present();
  }

  // Función para agregar una nueva asignatura a través de la API
  agregarAsignatura(nuevaAsignatura: Asignatura) {
    this.apicrud.postAsignaturas(nuevaAsignatura).subscribe(
      (response) => {
        console.log('Asignatura agregada correctamente', response);
        this.router.navigate(['/home']);  // Redirigir a la página principal
      },
      (error) => {
        console.error('Error al agregar la asignatura', error);
        alert('Hubo un error al agregar la asignatura. Intenta nuevamente.');
      }
    );
  }
}
