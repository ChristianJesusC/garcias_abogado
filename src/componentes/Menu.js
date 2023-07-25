  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import './diseñó/Menu.css';
  import Swal from 'sweetalert2';
  import DatePicker from 'react-datepicker';
  import 'react-datepicker/dist/react-datepicker.css';
  import es from 'date-fns/esm/locale/es';
  import { format } from 'date-fns';

  const redireccion = () => {
    window.location.href = '/minimn';
  };

  const ExpedientePage = () => {
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
    const [DemandadoExistente, setDemandadoExistente] = useState('');
    const [, setIdCliente] = useState('');
    const [Clientes, setClientes] = useState([]);
    const [SelectedCliente, setSelectedCliente] = useState('');
    const [demandadoButtonVisible, setDemandadoButtonVisible] = useState(true);
    const [fechaRegistro, setFechaRegistro] = useState('');
    const idAbogados = localStorage.getItem('idAbogado');
    const [Firmas, setFirmas] = useState(Array(4).fill(''));

    useEffect(() => {
      const obtenerFechaActual = () => {
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const fechaRegistro = new Date().toLocaleDateString(undefined, opciones);
        setFechaRegistro(fechaRegistro);
      };
      obtenerFechaActual();
    }, []);

    useEffect(() => {
      cargarClientes();
    }, []);

    const cargarClientes = () => {
      axios
        .get('https://server-api-6wm6.onrender.com/Obcliente')
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
              redireccion();
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

    const formatearFecha = (fecha) => {
      if (!fecha) return '';
      const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return format(new Date(fecha), "eeee, d 'de' MMMM 'de' yyyy", { locale: es });
    };

    const guardarCaso = async (event) => {
      event.preventDefault();
      if (
        !Titulo ||
        !Subtitulo ||
        !TipoJuicio ||
        !EstadoExpediente ||
        !Firmas ||
        !Descripcion ||
        !PrimeraFecha ||
        !PrimerLugar ||
        (DemandadoExistente === 'demandadoNuevo' && !Nombre) ||
        (DemandadoExistente === 'demandadoExistente' && !SelectedCliente)
      ) {
        Swal.fire('Error', 'Debes completar todos los campos obligatorios.', 'error');
        return;
      }

      if (SegundaFecha && SegundaFecha < PrimeraFecha) {
        Swal.fire('Error', 'La segunda fecha no puede ser menor que la primera fecha.', 'error');
        return;
      }

      if (DemandadoExistente === 'demandadoNuevo') {
        guardarCliente()
          .then((nuevoClienteId) => {
            guardarCasoEnTablaCasos(nuevoClienteId);
          })
          .catch((error) => {
            console.error(error);
          });
      } else if (DemandadoExistente === 'demandadoExistente') {
        const clienteSeleccionado = Clientes.find((cliente) => cliente.idCliente === parseInt(SelectedCliente));
        if (clienteSeleccionado) {
          guardarCasoEnTablaCasos(clienteSeleccionado.idCliente);
        } else {
          Swal.fire('Error', 'Cliente seleccionado no válido', 'error');
        }
      }
    };

    const guardarCasoEnTablaCasos = (clienteId) => {
      const fechaFormateadaPrimera = formatearFecha(PrimeraFecha);
      const fechaFormateadaSegunda = formatearFecha(SegundaFecha);

      axios
        .post('http://localhost:8081/agregarCaso', {
          Titulo: Titulo,
          Subtitulo: Subtitulo,
          TipoJuicio: TipoJuicio,
          EstadoExpediente: EstadoExpediente,
          Descripcion: Descripcion,
          PrimerLugar: PrimerLugar,
          PrimeraFecha: fechaFormateadaPrimera,
          SegundoLugar: SegundoLugar,
          SegundaFecha: fechaFormateadaSegunda,
          idAbogados: idAbogados,
          idCliente: clienteId,
          fechaRegistro: fechaRegistro,
          PrimeraFirma: Firmas[0],
          SegundaFirma: Firmas[1],
          TerceraFirma: Firmas[2],
          CuartaFirma: Firmas[3],
        })
        .then((response) => {
          if (response.data === 'Caso registrado exitosamente') {
            Swal.fire({
              title: 'Éxito',
              text: 'Caso registrado correctamente.',
              icon: 'success',
            }).then((result) => {
              if (result.isConfirmed) {
                redireccion();
              }
            });
          } else {
            Swal.fire('Error', response.data, 'error');
          }
        })
        .catch((error) => {
          console.error(error);
          Swal.fire('Error', 'Error al registrar el caso', 'error');
        });
    };

    const handleAddItem = (item) => {
      if (item === 'Agregar firma' && firmasCount < 4) {
        setFirmasCount((prevCount) => prevCount + 1);
      } else if (item === 'Agregar firma' && firmasCount >= 4) {
        Swal.fire('Error', 'Firmas límites alcanzados', 'error');
      } else if (item === 'Agregar ciudad y fecha' && ciudadFechaCount < 2) {
        setCiudadFechaCount((prevCount) => prevCount + 1);
      } else if (item === 'Agregar ciudad y fecha' && ciudadFechaCount >= 2) {
        Swal.fire('Error', 'Casillas límites alcanzados', 'error');
      }
    };

    const handleBack = () => {
      Swal.fire({
        title: 'Confirmar',
        text: '¿Deseas regresar al menú principal?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          redireccion();
        }
      });
    };

    const handleDemandadoButtonClick = (existente) => {
      setDemandadoExistente(existente);
      setDemandadoButtonVisible(false);
    };

    return (
      <div className="expediente-page">
        <div className="header">
          <h1>Formulario de Expediente</h1>
        </div>

        <div className="content">
          <div className="column">
            <label htmlFor="description">Descripción</label>
            <div className="form-group">
              <textarea id="description" name="description" onChange={(e) => setDescripcion(e.target.value)}></textarea>
            </div>

            <h4>Extras</h4>
            {[...Array(firmasCount)].map((_, index) => (
              <div className="form-group" key={index}>
                <label htmlFor={`additionalItem-${index}`}>Agregar firma</label>
                <input
                  type="text"
                  id={`additionalItem-${index}`}
                  onChange={(e) => {
                    const newFirmas = [...Firmas];
                    newFirmas[index] = e.target.value;
                    setFirmas(newFirmas);
                  }}
                  value={Firmas[index]}
                />
              </div>
            ))}
            {[...Array(ciudadFechaCount)].map((_, index) => (
              <div className="form-group mt-3" key={index}>
                <label htmlFor={`additionalItem-${index}`}>Agregar ciudad y fecha</label>
                <div className="form-row">
                  <div className="col">
                    <DatePicker
                      selected={index === 0 ? PrimeraFecha : SegundaFecha}
                      onChange={(date) => (index === 0 ? setPrimeraFecha(date) : setSegundaFecha(date))}
                      dateFormat="dd/MM/yyyy"
                      locale={es}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      className="form-control"
                      placeholderText="Fecha"
                    />
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      id={`additionalItem-${index}-lugar`}
                      onChange={(e) => (index === 0 ? setPrimerLugar(e.target.value) : setSegundoLugar(e.target.value))}
                      placeholder="Lugar"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="column">
            <label htmlFor="title">Título</label>
            <div className="form-group">
              <input type="text" id="title" name="title" onChange={(e) => setTitulo(e.target.value)} />
            </div>
            <label htmlFor="subtitle">Subtítulo</label>
            <div className="form-group">
              <input type="text" id="subtitle" name="subtitle" onChange={(e) => setSubtitulo(e.target.value)} />
            </div>
            {demandadoButtonVisible && (
              <div>
                <button
                  className={`add-item-button ${DemandadoExistente === 'demandadoNuevo' ? 'selected' : ''}`}
                  onClick={() => handleDemandadoButtonClick('demandadoNuevo')}
                >
                  Agregar demandado
                </button>
                .
                <button
                  className={`add-item-button ${DemandadoExistente === 'demandadoExistente' ? 'selected' : ''}`}
                  onClick={() => handleDemandadoButtonClick('demandadoExistente')}
                >
                  Demandado existente
                </button>
              </div>
            )}
            {DemandadoExistente === 'demandadoNuevo' && (
              <div>
                <input
                  type="text"
                  id="nombreDemandado"
                  name="nombreDemandado"
                  placeholder="Nombre"
                  onChange={(e) => setNombre(e.target.value)}
                />
                <input
                  type="text"
                  id="apellidoPaternoDemandado"
                  name="apellidoPaternoDemandado"
                  placeholder="Apellido Paterno"
                  onChange={(e) => setApePat(e.target.value)}
                />
                <input
                  type="text"
                  id="apellidoMaternoDemandado"
                  name="apellidoMaternoDemandado"
                  placeholder="Apellido Materno"
                  onChange={(e) => setApeMat(e.target.value)}
                />
              </div>
            )}

            {DemandadoExistente === 'demandadoExistente' && (
              <div>
                <label htmlFor="clienteSelect">Seleccionar cliente:</label>
                <select
                  id="clienteSelect"
                  name="clienteSelect"
                  value={SelectedCliente}
                  onChange={(e) => {
                    setSelectedCliente(e.target.value);
                    setIdCliente(e.target.value);
                  }}
                >
                  <option value="">Seleccionar</option>
                  {Clientes.map((cliente) => (
                    <option key={cliente.idCliente} value={cliente.idCliente}>
                      {cliente.Nombre} {cliente.apePat} {cliente.apeMat}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <p></p>
            <label htmlFor="lawsuitType">Tipo de Juicio</label>
            <div className="form-group">
              <select id="status" name="status" onChange={(e) => setTipoJuicio(e.target.value)}>
                <option>Seleccionar</option>
                <option value="Juicios laborales trabajador">Juicios laborales trabajador</option>
                <option value="Juicios laborales patrón">Juicios laborales patrón</option>
                <option value="Juicios orales mercantiles">Juicios orales mercantiles </option>
              </select>
            </div>
            <label htmlFor="status">Estado de expediente</label>
            <div className="form-group">
              <select id="status" name="status" onChange={(e) => setEstadoExpediente(e.target.value)}>
                <option>Seleccionar</option>
                <option value="Activa">Activa</option>
                <option value="Inactiva">Inactiva</option>
                <option value="En juicio">En juicio</option>
              </select>
            </div>

            <button className="add-item-button" onClick={() => handleAddItem('Agregar firma')} disabled={firmasCount > 4}>
              Agregar firma
            </button>
            <label>. .</label>
            <button
              className="add-item-button"
              onClick={() => handleAddItem('Agregar ciudad y fecha')}
              disabled={ciudadFechaCount > 2}
            >
              Agregar ciudad y fecha
            </button>
          </div>
        </div>

        <div className="footer">
          <label>. .</label>
          <button className="save-button" onClick={guardarCaso}>
            Guardar
          </button>
          <button className="save-button" onClick={handleBack}>
            Regresar
          </button>
        </div>
      </div>
    );
  };

  export default ExpedientePage;
