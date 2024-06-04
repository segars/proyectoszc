import './App.css';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { Dropdown } from 'react-bootstrap';

function App() {
  // Estados para los campos del formulario
  const [Producto, setProducto] = useState("");
  const [Fecha, setFecha] = useState("");
  const [Caducidad, setCaducidad] = useState("");
  const [Cantidad, setCantidad] = useState("");
  const [Costo, setCosto] = useState("");
  const [id, setId] = useState("");
  const [productosList, setProductos] = useState([]);
  const [editar, setEditar] = useState(false);
  const [advertencia, setAdvertencia] = useState(false);
  
  // Función para agregar un nuevo producto
  const add = () => {
    if (!Producto || !Fecha || !Caducidad || !Cantidad || !Costo) {
      setAdvertencia(true);
      return;
    }
    setAdvertencia(false);

    Axios.post("http://localhost:3001/create", {
      Producto,
      Fecha,
      Caducidad,
      Cantidad,
      Costo
    })
    .then((response) => {
      // Agrega el nuevo producto con su ID devuelto por la base de datos
      const newProduct = { id: response.data.id, Producto, Fecha, Caducidad, Cantidad, Costo };
      setProductos([...productosList, newProduct]);
      alert("Producto registrado");
    })
    .catch(error => {
      alert("Error al registrar el producto: " + error.message);
    });
  }

  const update = () => {
    if (!Producto || !Fecha || !Caducidad || !Cantidad || !Costo) {
      setAdvertencia(true);
      return;
    }
    setAdvertencia(false);

    Axios.put("http://localhost:3001/update", {
      id,
      Producto,
      Fecha,
      Caducidad,
      Cantidad,
      Costo
    })
    .then((response) => {
      // Actualizar el estado de los productos después de la actualización
      const updatedProducts = productosList.map(product => {
        if (product.id === id) {
          return {
            id: product.id,
            Producto,
            Fecha,
            Caducidad,
            Cantidad,
            Costo
          };
        }
        return product;
      });
      setProductos(updatedProducts);
      // Limpiar los campos del formulario después de la actualización
      setProducto("");
      setFecha("");
      setCaducidad("");
      setCantidad("");
      setCosto("");
      setId("");
      setEditar(false); // Desactivar el modo de edición
      alert("Producto actualizado");
    })
    .catch(error => {
      alert("Error al actualizar el producto: " + error.message);
    });
  }

  const editarProducto = (val) => {
    setEditar(true);

    setProducto(val.Producto);
    // Verificar si los valores de Fecha y Caducidad son válidos antes de establecer los estados
    if (val.Fecha) {
      setFecha(val.Fecha);
    }
    if (val.Caducidad) {
      setCaducidad(val.Caducidad);
    }
    setCantidad(val.Cantidad);
    setCosto(val.Costo);
    setId(val.id);
  }

  // Función para obtener la lista de productos al cargar la página
  const getProductos = () => {
    Axios.get("http://localhost:3001/Productos")
    .then((response) => {
      // Verifica que los datos recibidos sean los esperados
      if (Array.isArray(response.data)) {
        const validProducts = response.data.map(product => ({
          ...product,
          Costo: product.Costo?.data ? new TextDecoder().decode(new Uint8Array(product.Costo.data)) : product.Costo
        }));
        setProductos(validProducts);
      } else {
        console.error("Los datos recibidos no son un array:", response.data);
      }
    })
    .catch(error => {
      alert("Error al obtener los productos: " + error.message);
    });
  }

  // Obtener los productos cuando se carga la página
  useEffect(() => {
    getProductos();
  }, []);


  const formattedFecha = (fecha) => {
    return moment(fecha).format('YYYY-MM-DD');
  };
  // Formulario de registro
  return (
    <div className="container">
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          Registrar un producto
        </Dropdown.Toggle>

        <Dropdown.Menu style={{ minWidth: '33rem', padding: '1rem' }}>
          <div className="card text-center">
            <div className="card-header">
              FORMULARIO DE REGISTRO
            </div>
            <div className="card-body">
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Producto</span>
                <input 
                  type="text"
                  onChange={(event) => setProducto(event.target.value)}
                  className="form-control" value={Producto}
                  placeholder="Ingrese el nombre del Producto" 
                  aria-label="Producto" 
                  aria-describedby="basic-addon1" 
                />
              </div>
              <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Fecha de entrada</span>
                <input 
                  type="date"
                  onChange={(event) => setFecha(event.target.value)}
                  className="form-control" value={Fecha}
                  placeholder="Ingrese la fecha de entrada" 
                  aria-label="Fecha de entrada" 
                  aria-describedby="basic-addon1" 
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Fecha de caducidad</span>
                <input 
                  type="date"
                  onChange={(event) => setCaducidad(event.target.value)}
                  className="form-control" value={Caducidad}
                  placeholder="Ingrese la fecha de caducidad" 
                  aria-label="Fecha de caducidad" 
                  aria-describedby="basic-addon1" 
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Cantidad</span>
                <input 
                  type="number"
                  onChange={(event) => setCantidad(event.target.value)}
                  className="form-control" value={Cantidad}
                  placeholder="Ingrese la cantidad del producto" 
                  aria-label="Cantidad" 
                  aria-describedby="basic-addon1" 
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Costo del Producto</span>
                <input 
                  type="number"
                  onChange={(event) => setCosto(event.target.value)}
                  className="form-control" value={Costo}
                  placeholder="Ingrese el precio de este producto" 
                  aria-label="Costo del Producto" 
                  aria-describedby="basic-addon1" 
                />
              </div>
            </div>
            <div className="card-footer text-body-secondary">
              {
                editar ?
                  <div>
                    <button className='btn btn-outline-warning' onClick={update}>Actualizar</button>  <button className='btn btn-outline-danger' onClick={add}>Cancelar</button>
                  </div>
                  : <button className='btn btn-info' onClick={add}>Registrar</button>
              }
              {advertencia && <p className="text-danger">Por favor, complete todos los campos.</p>}
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>
      
      {/* Tabla de productos */}
      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Producto</th>
            <th scope="col">Fecha de ingreso</th>
            <th scope="col">Fecha de caducidad</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Costo</th>
            <th scope="col">acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosList.map((val) => {
            return (
              <tr key={val.id}>
                <th>{val.id}</th>
                <td>{val.Producto}</td>
                <td>{formattedFecha(val.Fecha)}</td> {/* Formatear la fecha */}
                <td>{formattedFecha(val.Caducidad)}</td> {/* Formatear la caducidad */}
                <td>{val.Cantidad}</td>
                <td>{val.Costo}</td>
                <td>
                  <div className="btn-group" role="group" aria-label="Basic example">
                    <button type="button"
                      onClick={() => {
                        editarProducto(val)
                      }}
                      className="btn btn-primary">Editar</button>
                    <button type="button" className="btn btn-danger">eliminar</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;