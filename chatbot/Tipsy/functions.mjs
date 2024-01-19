import axios from "axios";

const url = "http://localhost:3000/api/";

const functions_to_call = {
  recuperar_familiares: async (args) => {
    const jsonString = `{
         "Personas": [
             {
                 "Id": 2739,
                 "Nombre": "SOLANGE",
                 "Apellido": "Salek"
               
             },
             {
                 "Id": 217578,
                 "Nombre": "ABEL",
                 "Apellido": "GOMEZ"
                 
             }
         ],
         "PersonaTitular": {
             "Id": 2739,
             "Nombre": "SOLANGE",
             "Apellido": "Salek"
            
         },
         "IdRequest": null,
         "Exito": true,
         "Codigo": 200,
         "Mensaje": null,
         "Mensajes": [],
         "HasException": false
     }`;
     try {
      const data = JSON.parse(jsonString);
      return data;
     } catch (error) {
      console.error(error);
     }
   
    
  },
  obtener_cobertura_medica: async (args) => {
    const jsonString = `{
         "Coberturas": [
             {
                 "Id": 497296,
                 "Nombre": "OSDE - 210",
                 "VigenciaDesde": "11/10/2023",
                 "VigenciaHasta": "01/01/0001",
                 "EstaVigente": true,
                 "IdFinanciador": 20464,
                 "NombreFinanciador": "OSDE",
                 "IdPlan": 464,
                 "NumeroAfiliado": "61295841515"
             },
             {
                 "Id": 2999,
                 "Nombre": "PARTICULARES - Basico",
                 "VigenciaDesde": "05/11/2013",
                 "VigenciaHasta": "01/01/0001",
                 "EstaVigente": true,
                 "IdFinanciador": 6,
                 "NombreFinanciador": "PARTICULARES",
                 "IdPlan": 12,
                 "NumeroAfiliado": ""
             }
         ],
         "IdRequest": null,
         "Exito": true,
         "Codigo": 200,
         "Mensaje": null,
         "Mensajes": [],
         "HasException": false
     }`;
    const data = JSON.parse(jsonString);
    return data;
  },
  obtener_servicios_o_profesionales: async (args) => {
    const jsonString = `{
         "ServiciosConProfesional": [
             {
                 "IdServicio": 37,
                 "NombreDelServicio": "Alergia",
                 "IdProfesional": 2831,
                 "NombreDelProfesional": "MORENO, ANA",
                 "NombreDelCentroDeAtencion": "Hospital Privado",
                 "IdCentroDeAtencion": 1,
                 "VisibleEnTurnosWeb": true,
                 "HabilitadoTurnosWeb": true,
                 "MensajeTurnosWeb": null
             },
             {
                 "IdServicio": 37,
                 "NombreDelServicio": "Alergia",
                 "IdProfesional": 4202,
                 "NombreDelProfesional": "CARNERO, PATRICIA LAURA",
                 "NombreDelCentroDeAtencion": "Hospital Privado",
                 "IdCentroDeAtencion": 1,
                 "VisibleEnTurnosWeb": true,
                 "HabilitadoTurnosWeb": true,
                 "MensajeTurnosWeb": ""
             },
             {
                 "IdServicio": 37,
                 "NombreDelServicio": "Alergia",
                 "IdProfesional": 4262,
                 "NombreDelProfesional": "AMUCHASTEGUI, TOMAS",
                 "NombreDelCentroDeAtencion": "Hospital Privado",
                 "IdCentroDeAtencion": 1,
                 "VisibleEnTurnosWeb": true,
                 "HabilitadoTurnosWeb": true,
                 "MensajeTurnosWeb": "Este es el mensaje para la turnera online del paciente"
             }
         ],
         "IdRequest": null,
         "Exito": false,
         "Codigo": 422,
         "Mensaje": "Value cannot be null. (Parameter 'source')",
         "Mensajes": [],
         "HasException": false
     }`;
    const data = JSON.parse(jsonString);
    return data;
  },
  obtener_prestaciones_para_servicio_profesional: async (args) => {
    const data = {
      Profesionales: [
        {
          Id: 2831,
          Nombre: "MORENO, ANA",
          PrestacionEnServicioYCentro: {
            IdPrestacion: 1,
            NombrePrestacion: "CONSULTA TELEMEDICINA",
            IdServicio: 37,
            NombreServicio: "Alergia",
            IdCentroDeAtencion: 1,
            NombreCentroAtencion: "Hospital Privado",
            NombreServicioEnCentroDeAtencion: "Alergia - HP",
            VisibleTurnosWeb: true,
            VisibleTurnosWebTexto: "Si",
            Nombre: "CONSULTA TELEMEDICINA - Alergia - HP",
            HabilitadoTurnosWeb: true,
            HabilitadoTurnosWebTexto: "Si",
          },
        },
        {
          // ... más objetos siguiendo el mismo patrón
        },
      ],
      IdRequest: null,
      Exito: true,
      Codigo: 200,
      Mensaje: null,
      Mensajes: [],
      HasException: false,
    };
    return data;
  },
  obtener_instituciones_para_servicio_profesional_prestacion: async (args) => {
    const centrosData = {
      CentrosDeAtencion: [
        {
          Id: 1,
          Nombre: "Hospital Privado",
          Abreviatura: "HP",
          IdLocalidad: 987,
          IdInstitucion: 1,
          TelefonoUno: "0351 - 4686655",
          TelefonoDos: "",
          TelefonoTres: "",
          Observaciones: "",
          Latitud: -31.44219567011475,
          Longitud: -64.19917510483842,
          Domicilio: {
            DomicilioTexto: "Naciones Unidas 222",
            Calle: "Naciones Unidas",
            Altura: "222",
            Torre: "",
            Piso: "",
            Dpto: "",
            Barrio: "",
            CodigoPostal: "",
            IdPais: 14,
            IdProvincia: 4,
            IdLocalidad: 987,
            Pais: "Argentina",
            Provincia: "Cordoba",
            Localidad: "Cordoba",
          },
          Direccion: "Av. Naciones Unidas 346",
        },
        {
          Id: 63948,
          Nombre: "Hospital Raúl Ángel Ferreyra",
          Abreviatura: "HF",
          IdLocalidad: 987,
          IdInstitucion: 1,
          TelefonoUno: "0351 447-5799",
          TelefonoDos: "",
          TelefonoTres: "sds",
          Observaciones: "",
          Latitud: 0.0,
          Longitud: 0.0,
          Domicilio: {
            DomicilioTexto: "Naciones Unidas 222",
            Calle: "Naciones Unidas",
            Altura: "222",
            Torre: "",
            Piso: "",
            Dpto: "",
            Barrio: "",
            CodigoPostal: "",
            IdPais: 14,
            IdProvincia: 4,
            IdLocalidad: 987,
            Pais: "Argentina",
            Provincia: "Cordoba",
            Localidad: "Cordoba",
          },
          Direccion: "Av. Pablo Ricchieri 2200",
        },
        // ... puedes seguir agregando más centros si los hay
      ],
      IdRequest: null,
      Exito: true,
      Codigo: 200,
      Mensaje: null,
      Mensajes: [],
      HasException: false,
    };
    return centrosData;
  },
  obtener_primeros_turnos: async (args) => {
    const agendaData = {
      AgendaConFecha: {
        Id: 0,
        CalendarioDeProfesional: [
          {
            Id: 0,
            NombreDelProfesional: "AMUCHASTEGUI, TOMAS",
            IdProfesional: 4262,
            NombreDelCentro: "Hospital Privado",
            DiasDelCalendario: [
              {
                Id: 0,
                Nombre: null,
                Fecha: "16/01/2024",
                Turnos: [
                  {
                    Id: 5730889,
                    Documento: "",
                    TipoDocumento: null,
                    Nombre: "Alergia - HP",
                    Telefono: "0351 - 4686655",
                    Fecha: "2024-01-16T07:00:00",
                    Hora: "07:00",
                    Medico: "AMUCHASTEGUI, TOMAS",
                    Especialidad: "Alergia",
                    Lugar: "Hospital Privado",
                    Estado: "Libre",
                    RequisitoAdministrativo: [],
                    IdRecurso: 4262,
                    IdCentroDeAtencion: 1,
                    IdCobertura: 0,
                    IdFinanciador: 0,
                    NombreDeLaCobertura: "",
                    NombreDelFinanciador: "",
                    Appointment: null,
                    Valor: null,
                  },
                  {
                    Id: 5730890,
                    Documento: "",
                    TipoDocumento: null,
                    Nombre: "Alergia - HP",
                    Telefono: "0351 - 4686655",
                    Fecha: "2024-01-16T07:30:00",
                    Hora: "07:30",
                    Medico: "AMUCHASTEGUI, TOMAS",
                    Especialidad: "Alergia",
                    Lugar: "Hospital Privado",
                    Estado: "Libre",
                    RequisitoAdministrativo: [],
                    IdRecurso: 4262,
                    IdCentroDeAtencion: 1,
                    IdCobertura: 0,
                    IdFinanciador: 0,
                    NombreDeLaCobertura: "",
                    NombreDelFinanciador: "",
                    Appointment: null,
                    Valor: null,
                  },
                  {
                    Id: 5730891,
                    Documento: "",
                    TipoDocumento: null,
                    Nombre: "Alergia - HP",
                    Telefono: "0351 - 4686655",
                    Fecha: "2024-01-16T08:00:00",
                    Hora: "08:00",
                    Medico: "AMUCHASTEGUI, TOMAS",
                    Especialidad: "Alergia",
                    Lugar: "Hospital Privado",
                    Estado: "Libre",
                    RequisitoAdministrativo: [],
                    IdRecurso: 4262,
                    IdCentroDeAtencion: 1,
                    IdCobertura: 0,
                    IdFinanciador: 0,
                    NombreDeLaCobertura: "",
                    NombreDelFinanciador: "",
                    Appointment: null,
                    Valor: null,
                  },
                ],
              },
              {
                Id: 0,
                Nombre: null,
                Fecha: "17/01/2024",
                Turnos: [
                  {
                    Id: 5730915,
                    Documento: "",
                    TipoDocumento: null,
                    Nombre: "Alergia - HP",
                    Telefono: "0351 - 4686655",
                    Fecha: "2024-01-17T07:00:00",
                    Hora: "07:00",
                    Medico: "AMUCHASTEGUI, TOMAS",
                    Especialidad: "Alergia",
                    Lugar: "Hospital Privado",
                    Estado: "Libre",
                    RequisitoAdministrativo: [],
                    IdRecurso: 4262,
                    IdCentroDeAtencion: 1,
                    IdCobertura: 0,
                    IdFinanciador: 0,
                    NombreDeLaCobertura: "",
                    NombreDelFinanciador: "",
                    Appointment: null,
                    Valor: null,
                  },
                  {
                    Id: 5730916,
                    Documento: "",
                    TipoDocumento: null,
                    Nombre: "Alergia - HP",
                    Telefono: "0351 - 4686655",
                    Fecha: "2024-01-17T07:30:00",
                    Hora: "07:30",
                    Medico: "AMUCHASTEGUI, TOMAS",
                    Especialidad: "Alergia",
                    Lugar: "Hospital Privado",
                    Estado: "Libre",
                    RequisitoAdministrativo: [],
                    IdRecurso: 4262,
                    IdCentroDeAtencion: 1,
                    IdCobertura: 0,
                    IdFinanciador: 0,
                    NombreDeLaCobertura: "",
                    NombreDelFinanciador: "",
                    Appointment: null,
                    Valor: null,
                  },
                  {
                    Id: 5730917,
                    Documento: "",
                    TipoDocumento: null,
                    Nombre: "Alergia - HP",
                    Telefono: "0351 - 4686655",
                    Fecha: "2024-01-17T08:00:00",
                    Hora: "08:00",
                    Medico: "AMUCHASTEGUI, TOMAS",
                    Especialidad: "Alergia",
                    Lugar: "Hospital Privado",
                    Estado: "Libre",
                    RequisitoAdministrativo: [],
                    IdRecurso: 4262,
                    IdCentroDeAtencion: 1,
                    IdCobertura: 0,
                    IdFinanciador: 0,
                    NombreDeLaCobertura: "",
                    NombreDelFinanciador: "",
                    Appointment: null,
                    Valor: null,
                  },
                ],
              },
            ],
          },
        ],
      },
      Exito: true,
      Codigo: 200,
      Mensaje: null,
      Mensajes: [],
      HasException: false,
    };
    const turnosData = {
      Turnos: [
        {
          Id: 5730889,
          Documento: "",
          TipoDocumento: null,
          Nombre: "Alergia - HP",
          Telefono: "0351 - 4686655",
          Fecha: "2024-01-16T07:00:00",
          Hora: "07:00",
          Medico: "AMUCHASTEGUI, TOMAS",
          Especialidad: "Alergia",
          Lugar: "Hospital Privado",
          Estado: "Libre",
          RequisitoAdministrativo: [],
          IdRecurso: 4262,
          IdCentroDeAtencion: 1,
          IdCobertura: 0,
          IdFinanciador: 0,
          NombreDeLaCobertura: "",
          NombreDelFinanciador: "",
          Appointment: null,
          Valor: null,
        },
        // Aquí puedes añadir más turnos siguiendo el mismo patrón si es necesario
      ],
      IdRequest: null,
      Exito: true,
      Codigo: 200,
      Mensaje: null,
      Mensajes: [],
      HasException: false,
    };

    return turnosData;
  },
};
export default functions_to_call;
