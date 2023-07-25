import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import './editar.css';

const ocupacion = localStorage.getItem('ocupacion');

const redireccionar = () => {
  if (ocupacion === 'Gerente') {
    window.location.href = '/listaG';
  } else {
    window.location.href = '/lista';
  }
};

const Editar = () => {
  const [firmasCount, setFirmasCount] = useState(0);
  const [ciudadFechaCount, setCiudadFechaCount] = useState(0);
  const [Titulo, setTitulo] = useState('');
  const [Subtitulo, setSubtitulo] = useState('');
  const [TipoJuicio, setTipoJuicio] = useState('');
  const [EstadoExpediente, setEstadoExpediente] = useState('');
  const [PrimeraFecha, setPrimeraFecha] = useState(null);
  const [SegundaFecha, setSegundaFecha] = useState(null);
  const [PrimerLugar, setPrimerLugar] = useState('');
  const [SegundoLugar, setSegundoLugar] = useState('');
  const [Descripcion, setDescripcion] = useState('');
  const [Nombre, setNombre] = useState('');
  const [apePat, setApePat] = useState('');
  const [apeMat, setApeMat] = useState('');
  const [DemandadoExistente, setDemandadoExistente] = useState('demandadoExistente');
  const [idCliente, setIdCliente] = useState('');
  const [Clientes, setClientes] = useState([]);
  const [SelectedCliente, setSelectedCliente] = useState('');
  const [demandadoButtonVisible, setDemandadoButtonVisible] = useState(true);
  const idAbogados = localStorage.getItem('idAbogado');
  const [Firmas, setFirmas] = useState(Array(4).fill(''));

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = () => {
    axios
      .get('http://localhost:8081/Obcliente')
      .then((response) => {
        setClientes(response.data);
      })
      .catch((error) => {
        Swal.fire({
          title: 'ERROR',
          text: 'Fallo en la conexión',
          icon: 'warning',
        }).then((result) => {
          if (result.isConfirmed) {
            redireccionar();
          }
        });
      });
  };

  const guardarCliente = () => {
    return new Promise((resolve, reject) => {
      if (!Nombre || !apePat) {
        Swal.fire('Error', 'Debes completar todos los campos del cliente.', 'error');
        reject('Campos incompletos');
        return;
      }

      axios
        .post('http://localhost:8081/agregarCliente', {
          Nombre: Nombre,
          apePat: apePat,
          apeMat: apeMat,
        })
        .then((response) => {
          if (response.data.idCliente) {
            resolve(response.data.idCliente);
          } else {
            reject('Error al registrar el cliente');
          }
        })
        .catch((error) => {
          console.error(error);
          reject('Error al registrar el cliente');
        });
    });
  };

  const cancelarEdicion = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se perderán los cambios no guardados',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar edición',
      cancelButtonText: 'No, continuar editando',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        redireccionar();
      }
    });
  };

  const guardarCasoEnTablaCasos = (clienteId) => {
    const fechaFormateadaPrimera = PrimeraFecha ? format(PrimeraFecha, 'yyyy-MM-dd') : null;
    const fechaFormateadaSegunda = SegundaFecha ? format(SegundaFecha, 'yyyy-MM-dd') : null;

    axios
      .put(`http://localhost:8081/actualizarCaso/${localStorage.getItem('idCasos')}`, {
        Titulo: Titulo,
        Subtitulo: Subtitulo,
        TipoJuicio: TipoJuicio,
        EstadoExpediente: EstadoExpediente,
        PrimeraFecha: fechaFormateadaPrimera,
        PrimerLugar: PrimerLugar,
        SegundaFecha: fechaFormateadaSegunda,
        SegundoLugar: SegundoLugar,
        Descripcion: Descripcion,
        idCliente: clienteId,
        idAbogados: idAbogados,
        Firmas: Firmas,
      })
      .then((response) => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'El caso ha sido actualizado exitosamente.',
          icon: 'success',
        }).then((result) => {
          if (result.isConfirmed) {
            redireccionar();
          }
        });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire('Error', 'No se pudo actualizar el caso', 'error');
      });
  };

  const agregarFirma = () => {
    if (firmasCount < 3) {
      const newFirmas = [...Firmas];
      newFirmas[firmasCount + 1] = '';
      setFirmas(newFirmas);
      setFirmasCount((prevCount) => prevCount + 1);
    }
  };

  const eliminarFirma = () => {
    if (firmasCount > 0) {
      const newFirmas = [...Firmas];
      newFirmas[firmasCount] = '';
      setFirmas(newFirmas);
      setFirmasCount((prevCount) => prevCount - 1);
    }
  };

  const guardarFirmas = (clienteId) => {
    const nuevasFirmas = Firmas.filter((firma, index) => index <= firmasCount);
    const fechaFormateadaPrimera = PrimeraFecha ? format(PrimeraFecha, 'yyyy-MM-dd') : null;
    const fechaFormateadaSegunda = SegundaFecha ? format(SegundaFecha, 'yyyy-MM-dd') : null;

    axios
      .put(`http://localhost:8081/actualizarCaso/${localStorage.getItem('idCasos')}`, {
        Titulo: Titulo,
        Subtitulo: Subtitulo,
        TipoJuicio: TipoJuicio,
        EstadoExpediente: EstadoExpediente,
        PrimeraFecha: fechaFormateadaPrimera,
        PrimerLugar: PrimerLugar,
        SegundaFecha: fechaFormateadaSegunda,
        SegundoLugar: SegundoLugar,
        Descripcion: Descripcion,
        idCliente: clienteId,
        idAbogados: idAbogados,
        Firmas: nuevasFirmas,
      })
      .then((response) => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'El caso ha sido actualizado exitosamente.',
          icon: 'success',
        }).then((result) => {
          if (result.isConfirmed) {
            redireccionar();
          }
        });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire('Error', 'No se pudo actualizar el caso', 'error');
      });
  };

  const guardarCaso = () => {
    if (!SelectedCliente && DemandadoExistente === 'demandadoExistente') {
      Swal.fire('Error', 'Debes seleccionar un cliente existente o agregar uno nuevo.', 'error');
      return;
    }

    if (DemandadoExistente === 'demandadoExistente') {
      guardarCasoEnTablaCasos(SelectedCliente);
    } else {
      guardarCliente()
        .then((clienteId) => {
          guardarCasoEnTablaCasos(clienteId);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleChangeFirma = (index, event) => {
    const newFirmas = [...Firmas];
    newFirmas[index] = event.target.value;
    setFirmas(newFirmas);
  };

  return (
    <div className="editar-container bg-white">
      <h1>Editar Expediente</h1>
      <div className="editar-form">
        <div className="editar-form-section">
          <div className="editar-form-label">Título:</div>
          <input
            type="text"
            className="editar-form-input"
            value={Titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ingrese el título del expediente"
          />
        </div>

        <div className="editar-form-section">
          <div className="editar-form-label">Subtítulo:</div>
          <input
            type="text"
            className="editar-form-input"
            value={Subtitulo}
            onChange={(e) => setSubtitulo(e.target.value)}
            placeholder="Ingrese el subtítulo del expediente"
          />
        </div>

        <div className="editar-form-section">
          <div className="editar-form-label">Tipo de Juicio:</div>
          <input
            type="text"
            className="editar-form-input"
            value={TipoJuicio}
            onChange={(e) => setTipoJuicio(e.target.value)}
            placeholder="Ingrese el tipo de juicio"
          />
        </div>

        <div className="editar-form-section">
          <div className="editar-form-label">Estado del Expediente:</div>
          <input
            type="text"
            className="editar-form-input"
            value={EstadoExpediente}
            onChange={(e) => setEstadoExpediente(e.target.value)}
            placeholder="Ingrese el estado del expediente"
          />
        </div>

        <div className="editar-form-section">
          <div className="editar-form-label">Fecha 1:</div>
          <DatePicker
            selected={PrimeraFecha}
            onChange={(date) => setPrimeraFecha(date)}
            dateFormat="yyyy-MM-dd"
            className="editar-form-input"
            placeholderText="Seleccione una fecha"
          />
        </div>

        <div className="editar-form-section">
          <div className="editar-form-label">Fecha 2:</div>
          <DatePicker
            selected={SegundaFecha}
            onChange={(date) => setSegundaFecha(date)}
            dateFormat="yyyy-MM-dd"
            className="editar-form-input"
            placeholderText="Seleccione una fecha"
          />
        </div>

        <div className="editar-form-section">
          <div className="editar-form-label">Lugar 1:</div>
          <input
            type="text"
            className="editar-form-input"
            value={PrimerLugar}
            onChange={(e) => setPrimerLugar(e.target.value)}
            placeholder="Ingrese el primer lugar"
          />
        </div>

        <div className="editar-form-section">
          <div className="editar-form-label">Lugar 2:</div>
          <input
            type="text"
            className="editar-form-input"
            value={SegundoLugar}
            onChange={(e) => setSegundoLugar(e.target.value)}
            placeholder="Ingrese el segundo lugar"
          />
        </div>

        <div className="editar-form-section">
          <div className="editar-form-label">Descripción:</div>
          <textarea
            className="editar-form-textarea"
            value={Descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ingrese una descripción del expediente"
          />
        </div>

        {/* Selección de cliente */}
        <div className="editar-form-section">
          <div className="editar-form-label">Cliente:</div>
          <select
            className="editar-form-select"
            value={SelectedCliente}
            onChange={(e) => setSelectedCliente(e.target.value)}
          >
            <option value="">Seleccione un cliente</option>
            {Clientes.map((cliente) => (
              <option key={cliente.idCliente} value={cliente.idCliente}>
                {cliente.Nombre} {cliente.apePat} {cliente.apeMat}
              </option>
            ))}
          </select>
          {demandadoButtonVisible && (
            <button className="editar-form-btn" onClick={() => setDemandadoExistente('nuevoDemandado')}>
              Agregar Nuevo Cliente
            </button>
          )}
        </div>

        {/* Formulario para agregar nuevo cliente */}
        {DemandadoExistente === 'nuevoDemandado' && (
          <>
            <div className="editar-form-section">
              <div className="editar-form-label">Nombre:</div>
              <input
                type="text"
                className="editar-form-input"
                value={Nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingrese el nombre del cliente"
              />
            </div>

            <div className="editar-form-section">
              <div className="editar-form-label">Apellido Paterno:</div>
              <input
                type="text"
                className="editar-form-input"
                value={apePat}
                onChange={(e) => setApePat(e.target.value)}
                placeholder="Ingrese el apellido paterno del cliente"
              />
            </div>

            <div className="editar-form-section">
              <div className="editar-form-label">Apellido Materno:</div>
              <input
                type="text"
                className="editar-form-input"
                value={apeMat}
                onChange={(e) => setApeMat(e.target.value)}
                placeholder="Ingrese el apellido materno del cliente"
              />
            </div>
          </>
        )}

        {/* Agregar firmas */}
        <div className="editar-form-section">
          <div className="editar-form-label">Firmas:</div>
          {Firmas.map((firma, index) => (
            <input
              key={index}
              type="text"
              className="editar-form-input"
              value={firma}
              onChange={(e) => handleChangeFirma(index, e)}
              placeholder={`Firma ${index + 1}`}
            />
          ))}
          <div className="editar-form-buttons">
            <button className="editar-form-btn" onClick={agregarFirma}>
              Agregar Firma
            </button>
            <button className="editar-form-btn" onClick={eliminarFirma}>
              Eliminar Firma
            </button>
          </div>
        </div>

        <div className="editar-form-buttons">
          <button className="editar-form-btn" onClick={guardarCaso}>
            Guardar Cambios
          </button>
          <button className="editar-form-btn" onClick={cancelarEdicion}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editar;
