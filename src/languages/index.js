import es from './es.json';
import en from './en.json';

export const languages = {
  es: { name: 'Español', content: es },
  en: { name: 'English', content: en },
};

// funcion que se ocupa de obtener un lenguaje determinado
export const getLanguage = language => {
  const defaultLang = 'en';
  const navigatorLang = navigator.languages;

  // si no has especificado el lenguaje que deseas obtener
  // te asigno el ultimo que he obtenido
  if (!language) language = localStorage.getItem('language-default');

  // buscando coinciidencias de lenguaje en tu navegador
  for (let index = 0; index < navigatorLang.length && !language; index++) {
    if (languages[navigatorLang[index]]) language = navigatorLang[index];
  }

  // evaluanod que este lenguaje este en la lista de solicitados
  if (!language || !languages[language]) language = defaultLang;

  // guardo y devuelvo el lenguaje que fue seleccionado
  localStorage.setItem('language-default', language);
  return languages[language];
};

export default getLanguage;
