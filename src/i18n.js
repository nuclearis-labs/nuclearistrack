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
      navPhrase: 'NUCLEAR DOCUMENTATION BASED ON',
    },
    home: {
      security: {
        title: 'SECURITY',
        text:
          'SYSTEM BASED ON BLOCKCHAIN TECNOLOGY, THE NEW STANDARD IN SUPPLY CHAIN TECHNOLOGY',
      },
      availability: {
        title: 'AVAILABILITY OF INFORMATION',
        text:
          'JUST ENTERING THE PLATFORM, OBTAIN ACCESS TO ALL THE PROCESSES AND DOCUMENTS OF YOUR CONCERN.',
      },
      control: {
        title: 'CONTROL',
        text: 'REAL TIME INFORMATION ABOUT YOUR FABRICATION PROCESSES',
      },
    },
    general: {
      more: 'MORE',
    },
    benefits: {
      bannerTitle: 'TRANSPARENCY IN EVERY PROCESS',
      title: 'BENEFITS',
      security: {
        title: 'SECURITY',
        text:
          'SYSTEM BASED ON BLOCKCHAIN TECNOLOGY, THE NEW STANDARD IN SUPPLY CHAIN TECHNOLOGY',
      },
      availability: {
        title: 'AVAILABILITY OF INFORMATION',
        text:
          'JUST ENTERING THE PLATFORM, OBTAIN ACCESS TO ALL THE PROCESSES AND DOCUMENTS OF YOUR CONCERN.',
      },
      control: {
        title: 'CONTROL',
        text: 'REAL TIME INFORMATION ABOUT YOUR FABRICATION PROCESSES',
      },
    },
    login: {
      bannerTitle: 'LOGIN',
      user: 'USERNAME',
      passphrase: 'PASSWORD',
      submit: 'LOGIN',
    },
    contact: {
      bannerTitle: 'CONTACT',
      name: 'NAME',
      email: 'EMAIL',
      message: 'MESSAGE',
      submit: 'SEND',
    },
    forms: {
      newUser: 'NEW USER',
      name: 'NAME',
      mail: 'EMAIL',
      type: 'TYPE',
      selectOne: 'Select one...',
    },
  },
  sp: {
    header: {
      home: 'INICIO',
      benefits: 'BENEFICIOS',
      abstract: 'ABSTRACT',
      projects: 'PROYECTOS',
      user: 'USUARIOS',
      contact: 'CONTACTO',
      login: 'ACCEDER',
      logout: 'SALIR',
      navPhrase: 'TRAZABILIDAD DE FABRICACIÓN BASADA EN',
      navloggedPhrase: 'TRAZABILIDAD DE FABRICACIÓN BASADA EN BLOCKCHAIN',
    },
    home: {
      security: {
        title: 'SEGURIDAD',
        text:
          'SISTEMA CON TECNOLOGIA BLOCKCHAIN, EL NUEVO ESTANDARD DE TRAZABILIDAD DIGITAL.',
      },
      availability: {
        title: 'DISPONIBILIDAD',
        text:
          'CON SOLO INGRESAR EN LA PLATAFORMA TIENE DISPONIBILIDAD DE TODOS LOS PROCESOS Y CERTIFICADOS.',
      },
      control: {
        title: 'CONTROL',
        text: 'INFORMACION EN TIEMPO REAL DE LOS PROCESOS DE FABRICACION.',
      },
    },
    general: {
      more: 'MAS',
      supplier: 'Proveedor',
      client: 'Cliente',
    },
    benefits: {
      bannerTitle: 'TRANSPARENCIA EN TODOS NUESTROS PROCESOS',
      title: 'BENEFICIOS',
      security: {
        title: 'SEGURIDAD',
        text:
          '<p>La BLOCKCHAIN es un registro digital que funciona sobre una "cadena de bloques"asegurados criptográficamente. Dicha tecnología es extremadamente segura debido a su <strong>naturaleza distribuida</strong> y la <strong>irreversibilidad de las transacciones</strong>. La cadena de bloques, más conocida por el término en inglés BLOCKCHAIN, es un registro único, consensuado cuyo almacenaje está distribuido en cientos de miles de computadoras alrededor del mundo. Al ser una tecnología distribuida cada nodo de la red almacena una copia de la cadena la cual se actualiza segundo a segundo garantizando así la disponibilidad de la información en todo momento. La tecnología de BLOCKCHAIN nos permite almacenar información que jamás se podrá perder, modificar o eliminar.',
      },
      availability: {
        title: 'DISPONIBILIDAD DE LA INFORMACION',
        text:
          '<p>La Plataforma de Trazabilidad basada en BLOCKCHAIN desarrollada por NUCLEARIS permite almacenar la información técnica de los procesos productivos involucrados en la fabricación de componentes mecánicos para Centrales Nucleares. Toda la documentación técnica tal como certificados, formularios, calibraciones, ensayos, registros dimensionales, etc, que generan nuestros proveedores alrededor del mundo, es subida a nuestra plataforma por cada empresa proveedora en el momento en que sucede el proceso respectivo. De esta forma NUCLEARIS puede garantizar la autenticidad de la información debido a que una vez que fue subida a la BLOCKCHAIN nunca nadie podrá modificarla. La posibilidad de garantizar la veracidad y autenticidad de la información técnica otorga máxima confiabilidad respecto a la calidad de la pieza o componente mecánico producido. De esta manera los archivos generados por los proveedores que intervienen en los procesos productivos se suben a la red de almacenamiento descentralizada “IPFS” lo cual implica que a partir de ese momento toda la información es completamente inmutable, descentralizada y perpetua. Nunca se apaga, nunca se modifica y está siempre disponible para uso del cliente. </p>',
      },
      control: {
        title: 'CONTROL',
        text:
          '<p>Todos los sistemas de una Central Nuclear son construidos a partir de cientos de miles de piezas mecánicas las cuales deben ser diseñadas y fabricadas bajo exhaustivas normativas técnicas internacionales. Los operadores de dichas Centrales, mediante un permiso de acceso a nuestra Plataforma, podrán controlar en tiempo real los parámetros de los procesos productivos realizados sobre los componentes que posteriormente serán instalados en sus instalaciones.</p>',
      },
    },
    abstract: {
      bannerTitle: 'UN NUEVO STANDARD EN EL AREA DE DOCUMENTACION',
      title: '',
      section1: {
        title: 'STATU QUO',
        text: `<p>Desde la etapa del diseño de una Central Nuclear, la “Seguridad” conforma la máxima prioridad ya que tiene como objetivo reducir la probabilidad de que ocurra un accidente. 
      Dicha seguridad se establece a través del uso de normativas técnicas de reconocimiento internacional para garantizar niveles óptimos de calidad y confiabilidad de cada uno de sus componentes mecánicos que la integran. “Asegurar la calidad de cada una de las partes individuales de un Reactor Nuclear, asegurará en gran medida la confiabilidad del conjunto completo”.
      Los fabricantes de piezas mecánicas que integran un Reactor Nuclear son empresas certificadas por entes internacionales las cuales están obligadas a presentar “documentación en formato papel” con todos los datos de trazabilidad de cada uno de los procesos productivos que condujeron a la fabricación de cada pieza, tales como: certificados de materiales, ensayos, calibraciones, etc. 
      Es aquí en donde se presenta un punto de vulnerabilidad ya que dichos documentos podrían ser modificados, alterados o reemplazados por cualquiera de las empresas intervinientes de forma accidental o exprofeso y como consecuencia se perdería la trazabilidad del componente fabricado y por lo tanto dejaría de ser confiable.</p>`,
      },
      section2: {
        title: 'LA SOLUCIÓN',
        text: `<p>Mediante el uso de tecnología BLOCKCHAIN, la empresa NUCLEARIS desarrolló una Plataforma de Trazabilidad en la fabricación de componentes mecánicos de uso nuclear, brindando así una capa de seguridad adicional al Sistema de Calidad.
      Con esta aplicación de almacenamiento descentralizado, los fabricantes suben a la Plataforma la documentación técnica de su proceso industrial “en el momento en que se realiza el mismo” y queda almacenado allí de manera inmutable, in-hackeable y para siempre. 
      Esta metodología propuesta erradica la posibilidad de posteriores modificaciones de la documentación agregando valor y confiabilidad al producto final y consecuentemente al nivel de seguridad de la Central Nuclear misma.
      De esta manera, el operador de la Central podrá acceder a la Plataforma para verificar la autenticidad de la documentación comparando “los papeles” con los documentos digitales inmutables subidos a la BLOCKCHAIN.</p>`,
      },
      section3: {
        title: 'LA TECNOLOGÍA BLOCKCHAIN',
        text: `<p>A finales del año 2008, se publicó la tesis académica que dio origen a lo que en la actualidad es la red de almacenamiento descentralizada más grande del mundo la cual funciona al mismo tiempo en miles de computadores, servidores alrededor del mundo, con una capacidad computacional extraordinaria e imposible de modificar, hackear o “apagar”.
        la descentralización mencionada le provee a la red una inherente robustez y seguridad a ataques externos que es muy difícil conseguir en sistemas centralizados.
        Cabe destacar que lo que se sube a la BLOCKCHAIN son simplemente los códigos alfanuméricos denominados HASH que son las identificaciones criptográficas (a modo de “huella digital”) que representan de forma unívoca a cada uno de los documentos almacenados. 
        Con esta breve descripción se pretende explicar que la información de los documentos no es de acceso público bajo ningún punto de vista. El cliente podrá decidir el destino del almacenamiento de sus documentos, pudiendo ser en los servidores de la misma Central Nuclear, en servidores externos o bien se pueden almacenar en una red descentralizada de archivos.</p>`,
      },
    },
    faq: {
      bannerTitle: 'LAS PREGUNTAS MAS FRECUENTES',
    },
    login: {
      bannerTitle: 'ACCEDER',
      user: 'USUARIO',
      passphrase: 'CONTRASEÑA',
      submit: 'ACCEDER',
    },
    contact: {
      bannerTitle: 'ESTABLEZCA EL CONTACTO',
      title: 'CONTACTO',
      name: 'NOMBRE',
      email: 'CORREO ELECTRONICO',
      message: 'MENSAJE',
      submit: 'ENVIAR',
    },
    forms: {
      newUser: 'NUEVO USUARIO',
      name: 'NOMBRE',
      mail: 'CORREO ELECTRONICO',
      type: 'TIPO',
      address: 'DIRECCIÓN WALLET',
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
      send: 'ENVIAR',
    },
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
      navPhrase: 'NUKLEARE DOKUMENTATION BASIERT AUF',
    },
    home: {
      security: {
        title: 'SICHERHEIT',
        text:
          'SYSTEM MIT BLOCKCHAIN TECHNOLOGIE, DER NEUE STANDARD IN RÜCKVERFOLGBARKEIT.',
      },
      availability: {
        title: 'INFORMATION ALLZEIT BEREIT',
        text:
          'MIT DEM ZUGANG ZU DER PLATFORM, BEKOMMEN SIE VOLLSTÄNDIGEN ZUGRIFF AUF ALLE IHRE PROZESSE UND DOKUMENTE',
      },
      control: {
        title: 'KONTROLLE',
        text: 'INFORMATION IN ECHTZEIT ÜBER IHRE FABRIKATIONS PROZESSE',
      },
    },
    general: {
      more: 'MEHR',
    },
    benefits: {
      bannerTitle: 'TRANSPARENZ IN JEDEM PROZESS',
      title: 'VORTEILE',
      security: {
        title: 'SICHERHEIT',
        text:
          'SYSTEM MIT BLOCKCHAIN TECHNOLOGIE, DER NEUE STANDARD IN RÜCKVERFOLGBARKEIT.',
      },
      availability: {
        title: 'INFORMATION ALLZEIT BEREIT',
        text:
          'MIT DEM ZUGANG ZU DER PLATFORM, BEKOMMEN SIE VOLLSTÄNDIGEN ZUGRIFF AUF ALLE IHRE PROZESSE UND DOKUMENTE',
      },
      control: {
        title: 'KONTROLLE',
        text: 'INFORMATION IN ECHTZEIT ÜBER IHRE FABRIKATIONS PROZESSE',
      },
    },
    login: {
      bannerTitle: 'LOGIN',
      user: 'BENUTZERNAME',
      passphrase: 'PASSWORT',
      submit: 'EINLOGGEN',
    },
    contact: {
      bannerTitle: 'KONTAKT',
      name: 'NAME',
      email: 'EMAIL',
      message: 'NACHRICHT',
      submit: 'ABSCHICKEN',
    },
    forms: {
      user: 'BENUTZER',
      transfer: 'ÜBERWEISUNG',
      amount: 'BETRAG IN RBTC',
      selectOne: 'WÄHL EINEN AUS..',
      send: 'SENDEN',
    },
  },
};

const I18n = createI18n(locales, translations);

export default I18n;
