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
      navPhrase: 'NUCLEAR DOCUMENTATION BASED ON'
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
      security: 'ABSTRACT',
      projects: 'PROYECTOS',
      user: 'USUARIOS',
      contact: 'CONTACTO',
      login: 'ACCEDER',
      logout: 'SALIR',
      navPhrase: 'DOCUMENTACIÓN NUCLEAR BASADA EN'
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
      bannerTitle: 'UN NUEVO STANDARD EN EL AREA DE DOCUMENTACION',
      title: 'BLOCKCHAIN',
      first_paragraph:
        'En el futuro cercano, las metodologías de registro de documentacion migrarán hacia una tecnología digital que agregara confiabilidad a la trazabilidad de los procesos productivos de sus componentes mecánicos. El actual sistema de registro de documentación (en papel) resulta insuficientemente fiable y las grandes reguladoras mundiales están comenzando a observar a la tecnología Blockchain como la evolución natural en la tarea de otorgar confiabilidad a una actividad industrial tan sensible y crítica como lo es la generación de energía nuclear.',
      second_paragraph:
        'La metodología actual involucra la generación de documentos en cada una de las instancias productivas. Esto significa que hay Técnicos o Ingenieros cargando información en formularios preestablecidos los cuales se imprimen en papel y se adjuntan a una carpeta que continuamente acompaña las materias primas, materiales, semielaborados y productos terminados. Estar transportando papeles junto con los componentes mecánicos, posiblemente parezca una metodología “arcaica” pero es así como se realiza la trazabilidad de componentes mecánicos en la industria nuclear mundial y así lo exigen las normativas internacionales.',
      third_paragraph:
        'No se persigue romper con el statu quo de la “metodología papel”, sino que se pretende agregar una capa de confiabilidad digital basada en Blockchain para que cada vez que se elabore un documento también se guarde un hash criptográfico relacionado unívocamente y al mismo tiempo que ese documento digital sea guardado en un sistema de almacenamiento descentralizado para que permanezca allí durante las décadas que dure la vida útil del Reactor Nuclear.'
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
      selectOne: 'SELECCIONAR UNO...',
      create: 'CREAR',
      newProject: 'NUEVO PROYECTO',
      newProcess: 'NUEVO PROCESO',
      projectTitle: 'TITULO DE PROYECTO',
      client: 'CLIENTE',
      supplier: 'PROVEEDOR',
      expediente: 'EXPEDIENTE',
      oc: 'Nº DE ORDEN DE COMPRA',
      user: 'USUARIO',
      transfer: 'TRANSFERENCIA',
      amount: 'MONTO EN RBTC',
      send: 'ENVIAR'
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
      navPhrase: 'NUKLEARE DOKUMENTATION BASIERT AUF'
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
    },
    forms: {
      user: 'BENUTZER',
      transfer: 'ÜBERWEISUNG',
      amount: 'BETRAG IN RBTC',
      selectOne: 'WÄHL EINEN AUS..',
      send: 'SENDEN'
    }
  }
};

const I18n = createI18n(locales, translations);

export default I18n;
