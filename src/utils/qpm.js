import { QPM } from 'qpm-client-js';
import config from './qpm.config.json';

/* exportando la libreria del cliente determinado */
export const ClientQPM = QPM(config);
