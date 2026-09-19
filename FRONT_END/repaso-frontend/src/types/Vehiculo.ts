export interface Vehiculo {
  idVehiculo?: number;
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  precioDia: number;
  estado?: boolean;
}

export interface ApiMensaje {
  mensaje: string;
}