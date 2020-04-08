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
          '<p>La blockchain es una tecnología conceptualmente segura gracias a su <strong>naturaleza distribuida</strong>, la <strong>irreversibilidad de las transacciones</strong> y el <strong>uso intensivo de cifrado</strong>.</p><p> A continuacion entramos un poco mas en profundidad en cada punto:</p><ul><li style="padding-bottom:10px;">La red es descentralizada, funcionando en una gran cantidad de nodos que trabajan en la verificacion de transacciones y nuevos bloques, entre otras cosas.</li><li style="padding-bottom:10px;">Las transacciones que recibe la red se van integrando en los nuevos bloques que se crean, luego de las primeras 6 confirmaciones se vuelve infactible revertir transacciones pasadas.</li><li style="padding-bottom:10px;">La red se basa fuertemente en diversas tecnologias criptograficas como por ej. el firmado de transacciones o la creacion de nuevos bloques.</li></ul>'
      },
      availability: {
        title: 'DISPONIBILIDAD DE LA INFORMACION',
        text:
          '<p>La informacion sobre los proyectos, procesos y documentos de esta plataforma se encuentra guardada en los contratos inteligentes de la Blockchain de RSK.</p><p> Los archivos subidos por nuestros proveedores se suben a la red de almacenamiento descentralizada IPFS. Todo eso significa que la informacion es completamente descentralizada y nunca se apaga, o tiene paradas por mantenimiento.</p>'
      },
      control: {
        title: 'CONTROL',
        text:
          '<p>Los archivos y la informacion relacionada con ellos, se sube exclusivamente por el generador de la documentacion. Lo cual evita cualquier tipo de intermediario entre los proveedores involucrados en los procesos productivos y el cliente.</p><p>El cliente a su vez, tiene permiso de verificacion y acceso a la documentacion brindada, relacionada a sus proyectos.</p>'
      }
    },
    security: {
      bannerTitle: 'UN NUEVO STANDARD EN EL AREA DE DOCUMENTACION',
      title: '',
      text: `<strong>Status quo</strong><p>La industria nuclear depende de la documentacion de sus componentes por igual o mas que del componente en su forma fisica.
        Eso llevo a la industria a hacer grandes esfuerzos a la hora de compilar, verificar y resguardar toda la informacion relacionada
        a todos los componentes instalados en las centrales nucleares.</p>
        Hasta el dia de hoy, dicha documentacion se imprime en papel y se adjuntan a una carpeta que continuamente acompaña 
        las materias primas, materiales, semielaborados y productos terminados. Estar transportando papeles junto con los componentes mecánicos, 
        posiblemente parezca una metodología “arcaica” pero es así como se realiza la trazabilidad de componentes mecánicos en
        la industria nuclear mundial y así lo exigen las normativas internacionales.</p>
        <strong>Una nueva tecnologia emerge</strong>
        <p>A finales del año 2008, se publico la tesis
        academica que dio origen a Bitcoin, en la actualidad la red Blockchain mas grande a nivel mundial. 
        Se trata de una red completamente descentralizada que funciona en miles de computadores, servidores alrededor del 
        mundo, con una capacidad computacional extraordinaria.</p><p>La descentralizacion mencionada le provee a 
        la red una robustez y seguridad a ataques externos que es muy dificil conseguir en sistemas centralizados</p>
        <strong>La plataforma se presenta</strong>
        <p>La presente plataforma se basa fuertemente en la tecnologia Blockchain para el resguardo de la informacion
        brindada por la cadena de los proveedores.</p><p>Toda la informacion acerca de proyectos y procesos se guarda en 
        contratos inteligentes ubicados en la Blockchain.</p><p>Los archivos brindados por nuestros proveedores,
        se encriptan y luego se suben a una red descentralizada de almacenamiento de archivos. Lo cual permite tener siempre una copia disponible
        y evita tener un punto critico de falla que puede haber al tener todos los archivos centralizados en un servidor.</p>`
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
