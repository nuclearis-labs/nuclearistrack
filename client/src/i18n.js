import { createI18n } from 'react-router-i18n';

// Array of supported locales
// The first in the array is treated as the default locale
const locales = ['sp', 'en', 'de'];
// Dictionary of translations
const translations = {
  en: {
    header: {
      home: 'HOME',
      benefits: 'BENEFITS',
      security: 'SECURITY',
      projects: 'PROJECTS',
      user: 'USERS',
      contact: 'CONTACT',
      login: 'LOGIN',
      logout: 'LOGOUT',
      navPhrase: 'DECENTRALIZED SUPPLY CHAIN PLATFORM'
    },
    home: {
      security: {
        title: 'SECURITY',
        text:
          'SYSTEM BASED ON BLOCKCHAIN TECNOLOGY, THE NEW STANDARD IN SUPPLY CHAIN TECHNOLOGY'
      },
      availability: {
        title: 'AVAILABILITY OF INFORMATION',
        text:
          'JUST ENTERING THE PLATFORM, OBTAIN ACCESS TO ALL THE PROCESSES AND DOCUMENTS OF YOUR CONCERN.'
      },
      control: {
        title: 'CONTROL',
        text: 'REAL TIME INFORMATION ABOUT YOUR FABRICATION PROCESSES'
      }
    },
    general: {
      more: 'MORE'
    },
    benefits: {
      bannerTitle: 'TRANSPARENCY IN EVERY PROCESS',
      title: 'BENEFITS',
      security: {
        title: 'SECURITY',
        text:
          'SYSTEM BASED ON BLOCKCHAIN TECNOLOGY, THE NEW STANDARD IN SUPPLY CHAIN TECHNOLOGY'
      },
      availability: {
        title: 'AVAILABILITY OF INFORMATION',
        text:
          'JUST ENTERING THE PLATFORM, OBTAIN ACCESS TO ALL THE PROCESSES AND DOCUMENTS OF YOUR CONCERN.'
      },
      control: {
        title: 'CONTROL',
        text: 'REAL TIME INFORMATION ABOUT YOUR FABRICATION PROCESSES'
      }
    },
    contact: {
      title: 'CONTACT',
      name: 'NAME',
      email: 'EMAIL',
      message: 'MESSAGE',
      submit: 'SEND'
    },
    forms: {
      newUser: 'NEW USER',
      name: 'NAME',
      mail: 'EMAIL',
      type: 'TYPE',
      selectOne: 'Select one...'
    }
  },
  sp: {
    header: {
      home: 'INICIO',
      benefits: 'BENEFICIOS',
      security: 'SEGURIDAD',
      projects: 'PROYECTOS',
      user: 'USUARIOS',
      contact: 'CONTACTO',
      login: 'ACCEDER',
      logout: 'SALIR',
      navPhrase: 'PLATAFORMA DESCENTRALIZADA DE TRAZABILIDAD'
    },
    home: {
      security: {
        title: 'SEGURIDAD',
        text:
          'SISTEMA CON TECNOLOGIA BLOCKCHAIN, EL NUEVO ESTANDARD DE TRAZABILIDAD DIGITAL.'
      },
      availability: {
        title: 'DISPONIBILIDAD DE LA INFORMACION',
        text:
          'CON SOLO INGRESAR EN LA PLATAFORMA TIENE DISPONIBILIDAD DE TODOS LOS PROCESOS Y CERTIFICADOS.'
      },
      control: {
        title: 'CONTROL',
        text: 'INFORMACION EN TIEMPO REAL DE LOS PROCESOS DE FABRICACION.'
      }
    },
    general: {
      more: 'MAS',
      supplier: 'Proveedor',
      client: 'Cliente'
    },
    benefits: {
      bannerTitle: 'TRANSPARENCIA EN TODOS NUESTROS PROCESOS',
      title: 'BENEFICIOS',
      security: {
        title: 'SEGURIDAD',
        text:
          'SISTEMA CON TECNOLOGIA BLOCKCHAIN, EL NUEVO ESTANDARD DE TRAZABILIDAD DIGITAL.'
      },
      availability: {
        title: 'DISPONIBILIDAD DE LA INFORMACION',
        text:
          'CON SOLO INGRESAR EN LA PLATAFORMA TIENE DISPONIBILIDAD DE TODOS LOS PROCESOS Y CERTIFICADOS.'
      },
      control: {
        title: 'CONTROL',
        text: 'INFORMACION EN TIEMPO REAL DE LOS PROCESOS DE FABRICACION.'
      }
    },
    security: {
      bannerTitle: 'UN NUEVO STANDARD EN SEGURIDAD',
      title: 'BLOCKCHAIN',
      text:
        'BLOCKCHAIN ES UNA TECNOLOGÍA QUE PERMITE LA TRANSFERENCIA DE DATOS DIGITALES CON UNA CODIFICACIÓN MUY SOFISTICADA Y DE UNA MANERA COMPLETAMENTE SEGURA. SERÍA COMO EL LIBRO DE ASIENTOS DE CONTABILIDAD DE UNA EMPRESA EN DONDE SE REGISTRAN TODAS LAS ENTRADAS Y SALIDAS DE DINERO; EN ESTE CASO HABLAMOS DE UN LIBRO DE ACONTECIMIENTOS DIGITALES. PERO ADEMÁS, CONTRIBUYE CON UNA TREMENDA NOVEDAD: ESTA TRANSFERENCIA NO REQUIERE DE UN INTERMEDIARIO CENTRALIZADO QUE IDENTIFIQUE Y CERTIFIQUE LA INFORMACIÓN, SINO QUE ESTÁ DISTRIBUIDA EN MÚLTIPLES NODOS INDEPENDIENTES ENTRE SÍ QUE LA REGISTRAN Y LA VALIDAN SIN NECESIDAD DE QUE HAYA CONFIANZA ENTRE ELLOS. UNA VEZ INTRODUCIDA, LA INFORMACIÓN NO PUEDE SER BORRADA, SOLO SE PODRÁN AÑADIR NUEVOS REGISTROS, Y NO SERÁ LEGITIMADA A MENOS QUE LA MAYORÍA DE ELLOS SE PONGAN DE ACUERDO PARA HACERLO. JUNTO AL NIVEL DE SEGURIDAD QUE PROPORCIONA ESTE SISTEMA FRENTE A HACKEOS, ENCONTRAMOS OTRA ENORME VENTAJA: AUNQUE LA RED SE CAYERA, CON QUE SOLO UNO DE ESOS ORDENADORES O NODOS NO LO HICIERA, LA INFORMACIÓN NUNCA SE PERDERÍA O EL SERVICIO, SEGÚN EL CASO DEL QUE HABLEMOS, SEGUIRÍA FUNCIONANDO.'
    },
    contact: {
      title: 'CONTACTO',
      name: 'NOMBRE',
      email: 'CORREO ELECTRONICO',
      message: 'MENSAJE',
      submit: 'ENVIAR'
    },
    forms: {
      newUser: 'NUEVO USUARIO',
      name: 'NOMBRE',
      mail: 'CORREO ELECTRONICO',
      type: 'TIPO',
      selectOne: 'Seleccionar...',
      create: 'CREAR',
      newProject: 'NUEVO PROYECTO',
      newProject: 'NUEVO PROCESO',
      projectTitle: 'TITULO DE PROYECTO',
      client: 'CLIENTE',
      supplier: 'PROVEEDOR',
      expediente: 'EXPEDIENTE',
      oc: 'Nº DE ORDEN DE COMPRA'
    }
  },
  de: {
    header: {
      home: 'START',
      benefits: 'VORTEILE',
      security: 'SICHERHEIT',
      projects: 'PROJEKTE',
      user: 'BENUTZER',
      contact: 'KONTAKT',
      login: 'ANMELDEN',
      logout: 'ABMELDEN',
      navPhrase: 'DEZENTRALISIERTE PLATFORM FÜR DIE RÜCKVERFOLGBARKEIT'
    },
    home: {
      security: {
        title: 'SICHERHEIT',
        text:
          'SYSTEM MIT BLOCKCHAIN TECHNOLOGIE, DER NEUE STANDARD IN RÜCKVERFOLGBARKEIT.'
      },
      availability: {
        title: 'INFORMATION ALLZEIT BEREIT',
        text:
          'MIT DEM ZUGANG ZU DER PLATFORM, BEKOMMEN SIE VOLLSTÄNDIGEN ZUGRIFF AUF ALLE IHRE PROZESSE UND DOKUMENTE'
      },
      control: {
        title: 'KONTROLLE',
        text: 'INFORMATION IN ECHTZEIT ÜBER IHRE FABRIKATIONS PROZESSE'
      }
    },
    general: {
      more: 'MEHR'
    },
    benefits: {
      bannerTitle: 'TRANSPARENZ IN JEDEM PROZESS',
      title: 'VORTEILE',
      security: {
        title: 'SICHERHEIT',
        text:
          'SYSTEM MIT BLOCKCHAIN TECHNOLOGIE, DER NEUE STANDARD IN RÜCKVERFOLGBARKEIT.'
      },
      availability: {
        title: 'INFORMATION ALLZEIT BEREIT',
        text:
          'MIT DEM ZUGANG ZU DER PLATFORM, BEKOMMEN SIE VOLLSTÄNDIGEN ZUGRIFF AUF ALLE IHRE PROZESSE UND DOKUMENTE'
      },
      control: {
        title: 'KONTROLLE',
        text: 'INFORMATION IN ECHTZEIT ÜBER IHRE FABRIKATIONS PROZESSE'
      }
    },
    contact: {
      title: 'KONTAKT',
      name: 'NAME',
      email: 'EMAIL',
      message: 'NACHRICHT',
      submit: 'ABSCHICKEN'
    }
  }
};

const I18n = createI18n(locales, translations);

export default I18n;
