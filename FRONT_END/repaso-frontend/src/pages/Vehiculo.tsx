import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import {
  getVehiculosActivos,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo
} from "../services/VehiculoServices";
import type { Vehiculo } from "../types/vehiculo";

const formInicial: Vehiculo = {
  idVehiculo: undefined,
  placa: "",
  marca: "",
  modelo: "",
  color: "",
  precioDia: 0
};

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [form, setForm] = useState<Vehiculo>(formInicial);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargarVehiculos = async () => {
    try {
      const respuesta = await getVehiculosActivos();
      if (Array.isArray(respuesta)) {
        setVehiculos(respuesta);
      } else {
        console.error("La respuesta no es un arreglo:", respuesta);
        setVehiculos([]);
      }
    } catch (error) {
      console.error("Error al listar vehículos", error);
      setVehiculos([]);
    }
  };

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "precioDia" ? Number(value) : value
    }));
  };

  const obtenerMensajeError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.mensaje ?? error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "Ocurrió un error inesperado";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (modoEdicion && form.idVehiculo !== undefined) {
        await updateVehiculo(form.idVehiculo, form);
        setMensaje("Vehículo actualizado correctamente");
      } else {
        await createVehiculo(form);
        setMensaje("Vehículo creado correctamente");
      }
      setForm(formInicial);
      setModoEdicion(false);
      cargarVehiculos();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
      console.error("Error al guardar vehículo", error);
    }
  };

  const handleModificar = (vehiculo: Vehiculo) => {
    setForm(vehiculo);
    setModoEdicion(true);
  };

  const handleAnular = async (idVehiculo: number) => {
    const confirmar = window.confirm("¿Seguro que deseas anular este vehículo?");
    if (!confirmar) return;
    try {
      await deleteVehiculo(idVehiculo);
      setMensaje("Vehículo anulado correctamente");
      cargarVehiculos();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
      console.error("Error al anular el vehículo", error);
    }
  };

  const handleCancelar = () => {
    setForm(formInicial);
    setModoEdicion(false);
    setMensaje("");
  };

  return (
    <div>
      {/* Barra de navegación superior */}
      <nav className="navbar">
        <span className="nav-link">Categorías</span>
        <span className="nav-link">Productos</span>
        <span className="nav-link">Clientes</span>
      </nav>

      {/* Envoltorio principal y tarjeta centrada */}
      <div className="main-wrapper">
        <div className="card-container">
          <h2 className="card-title">
            {modoEdicion ? "Modificar Vehículo" : "Ingresar/Modificar Vehículos"}
          </h2>
          
          {mensaje && <p className="mensaje-alerta">{mensaje}</p>}
          
          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <label htmlFor="placa">Placa: </label>
              <input type="text" id="placa" name="placa" value={form.placa} onChange={handleChange} required className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="marca">Marca: </label>
              <input type="text" id="marca" name="marca" value={form.marca} onChange={handleChange} required className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="modelo">Modelo: </label>
              <input type="text" id="modelo" name="modelo" value={form.modelo} onChange={handleChange} required className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="color">Color: </label>
              <input type="text" id="color" name="color" value={form.color} onChange={handleChange} required className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="precioDia">Precio por Día: </label>
              <input type="number" id="precioDia" name="precioDia" value={form.precioDia} onChange={handleChange} required className="form-input" />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button type="submit" className="btn-guardar">{modoEdicion ? "Actualizar" : "Guardar"}</button>
              {modoEdicion && <button type="button" onClick={handleCancelar} className="btn-cancelar">Cancelar</button>}
            </div>
          </form>

          <h3 className="card-title">Listado de Vehículos</h3>

          <table className="tabla-vehiculos">
            <thead>
              <tr>
                <th>Placa</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Color</th>
                <th>Precio Día</th>
                <th>Modificar</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(vehiculos) && vehiculos.map((v) => (
                <tr key={v.idVehiculo}>
                  <td>{v.placa}</td>
                  <td>{v.marca}</td>
                  <td>{v.modelo}</td>
                  <td>{v.color}</td>
                  <td>Q{v.precioDia}</td>
                  <td>
                    <button type="button" onClick={() => handleModificar(v)} className="btn-accion">Modificar</button>
                  </td>
                  <td>
                    <button type="button" onClick={() => v.idVehiculo !== undefined && handleAnular(v.idVehiculo)} className="btn-accion">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}