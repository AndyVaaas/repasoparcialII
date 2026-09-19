import api from "../api/axios";
import type { Vehiculo } from "../types/vehiculo";

export interface MessageResponse {
  mensaje: string;
}

export const getVehiculosActivos = async () => {
  const response = await api.get<Vehiculo[]>("/mostrarActivos");
  return response.data;
};

export const createVehiculo = async (data: Omit<Vehiculo, "idVehiculo">) => {
  const response = await api.post<MessageResponse>("", data);
  return response.data;
};

export const updateVehiculo = async (
  id: number,
  data: Omit<Vehiculo, "idVehiculo">
) => {
  const response = await api.put<MessageResponse>(`/${id}`, data);
  return response.data;
};

export const deleteVehiculo = async (id: number) => {
  const response = await api.put<MessageResponse>(`/anular/${id}`);
  return response.data;
};
