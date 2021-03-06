import { QPM } from "qpm-client-js";
import config from "./qpm.config.json";
let session = !localStorage.getItem("qpm-session") == false;

// permiste verificar los datos del usuario
export const isLogin = () => session;

// funcion que se encarga de cerrar cesion
export const setLogout = async () => {
  const { username } = ClientQPM.getCurrentUser();

  const data = await ClientQPM.method("logOutServer", {
    username: { username },
  })
    .fetch()
    .then((t) => t)
    .catch((error) => {
      throw error;
    });

  localStorage.removeItem("qpm-session");
  session = false;
  return data;
};

/* exportando la libreria del cliente determinado */
export const ClientQPM = QPM(
  localStorage.getItem("qpm-session")
    ? JSON.parse(localStorage.getItem("qpm-session"))
    : {}
);

if (window && !window.ClientQPM) window.ClientQPM = ClientQPM;

/* funcion que se encarga de el inicio de session de un usuario */
export const ClientLogin = async function({ username, password }) {
  const params = {
    username,
    password,
    server: config.server,
    calcdb: config.calcdb,
    ctrldb: config.ctrldb,
  };

  const data = await ClientQPM.login(params).then((t) => t);
  session = data.result == "OK";

  // esto demuestar que no hubo una autentificacion
  if (!session) {
    localStorage.removeItem("qpm-session");
    throw "Unauthenticate";
  }

  localStorage.setItem("qpm-session", JSON.stringify({ ...params, ...data }));
  return data;
};
