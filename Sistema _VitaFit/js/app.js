import { cargarClientes } from "./data-service.js";

const enlaceInicio = document.querySelector('.home-nav a[href="#somos"]');
  const enlaceServicios = document.querySelector('.home-nav a[href="#servicios"]');
  const enlacePanelAnterior = document.querySelectorAll('.home-nav a')[2];
  if (enlaceInicio && enlaceServicios) {
    enlaceInicio.href = '#inicio';
    enlaceInicio.textContent = 'Quiénes somos';
    enlaceServicios.href = '#panel';
    enlaceServicios.textContent = 'Panel de clientes y filtros';
    enlacePanelAnterior?.remove();
  }

  function mostrarVista(vista) {
    const mostrarPanel = vista === 'panel';
    document.body.classList.toggle('panel-view', mostrarPanel);
    document.body.classList.toggle('about-view', !mostrarPanel);
    document.querySelectorAll('.home-nav a').forEach(enlace => {
      enlace.classList.toggle('active', mostrarPanel
        ? enlace.getAttribute('href') === '#panel'
        : enlace.getAttribute('href') !== '#panel');
    });
    history.replaceState(null, '', mostrarPanel ? '#panel' : '#somos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('a[href="#panel"]').forEach(enlace => {
    enlace.addEventListener('click', evento => {
      evento.preventDefault();
      mostrarVista('panel');
    });
  });

  document.querySelectorAll('a[href="#somos"], a[href="#inicio"]').forEach(enlace => {
    enlace.addEventListener('click', evento => {
      evento.preventDefault();
      mostrarVista('home');
    });
  });

  if (window.location.hash === '#panel') {
    mostrarVista('panel');
  }

  const boton = document.getElementById("buscar");
  const entrada = document.getElementById("cliente");
  const resultado = document.getElementById("resultado");

  let clientes = [];

    function escaparHtml(valor) {
    return String(valor ?? "").replace(/[&<>'"]/g, caracter => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    })[caracter]);
  }

  function consultarCliente() {
    const id = entrada.value.trim().toLowerCase();

    if (!id) {
      resultado.textContent = "Ingrese un identificador de cliente.";
      return;
    }

    const cliente = clientes.find(registro =>
      registro.ID_Cliente?.toLowerCase() === id
    );

    if (!cliente) {
      resultado.textContent =
        "Cliente no encontrado en los 2.000 registros de prueba.";
      return;
    }

    const probabilidad =
      Number(cliente.Puntaje_Riesgo) * 100;

    const prediccion =
      Number(cliente.Prediccion_Modelo);

    const clasificacion = prediccion === 1
      ? "Posible cancelación"
      : "Posible permanencia";

    const recomendacion = prediccion === 1
      ? "Revisar la situación del cliente y valorar un contacto personalizado."
      : "Mantener el seguimiento habitual del cliente.";

    
resultado.textContent =
    "Cliente: " + cliente.ID_Cliente +
    "\nSucursal: " + cliente.Sucursal +
    "\nTipo de membresía: " + cliente.Tipo_Membresia +
    "\nVisitas al mes: " + cliente.Visitas_Mes +
    "\nDías desde la última visita: " + cliente.Dias_Ultima_Visita +
    "\nQuejas en los últimos 6 meses: " + cliente.Quejas_6M +
    "\n\nProbabilidad estimada de cancelación: " +
    probabilidad.toFixed(2) + "%" +
    "\nClasificación del modelo: " + clasificacion +
    "\nAcción recomendada: " + recomendacion;


    resultado.style.whiteSpace = "pre-line";

    const riesgoColor = prediccion === 1 ? "#dc5a5a" : "#0b9b83";
    const riesgoTexto = prediccion === 1 ? "Atención prioritaria" : "Cliente estable";
    resultado.innerHTML = `
      <div class="resultado-dashboard">
        <div class="risk-summary" style="--risk-value: ${probabilidad}; --risk-color: ${riesgoColor};">
          <div class="risk-score">
            <div class="risk-ring" aria-label="Riesgo estimado ${probabilidad.toFixed(2)} por ciento"><strong>${probabilidad.toFixed(0)}%</strong></div>
            <div><p class="risk-label">Riesgo estimado</p><p class="risk-status">${riesgoTexto}</p></div>
          </div>
          <div>
            <div class="risk-bar-label"><span>Probabilidad de cancelación</span><strong>${probabilidad.toFixed(2)}%</strong></div>
            <div class="risk-track" role="progressbar" aria-valuenow="${probabilidad.toFixed(2)}" aria-valuemin="0" aria-valuemax="100"><div class="risk-fill"></div></div>
          </div>
        </div>
        <div class="detail-grid">
          <div class="detail-card"><span>Cliente</span><strong>${escaparHtml(cliente.ID_Cliente)}</strong></div>
          <div class="detail-card"><span>Sucursal</span><strong>${escaparHtml(cliente.Sucursal)}</strong></div>
          <div class="detail-card"><span>Membresía</span><strong>${escaparHtml(cliente.Tipo_Membresia)}</strong></div>
          <div class="detail-card"><span>Visitas al mes</span><strong>${escaparHtml(cliente.Visitas_Mes)}</strong></div>
          <div class="detail-card"><span>Días sin visita</span><strong>${escaparHtml(cliente.Dias_Ultima_Visita)}</strong></div>
          <div class="detail-card"><span>Quejas · 6 meses</span><strong>${escaparHtml(cliente.Quejas_6M)}</strong></div>
          <div class="detail-card"><span>Clasificación</span><strong>${clasificacion}</strong></div>
          <div class="detail-card"><span>Modelo</span><strong>Logística</strong></div>
        </div>
        <div class="recommendation"><span class="recommendation-icon">!</span><div><strong>Recomendación de gestión</strong>${recomendacion}</div></div>
      </div>`;
    
if (prediccion === 1) {
    resultado.style.backgroundColor = "#fff0f0";
    resultado.style.color = "#991b1b";
    resultado.style.borderLeft = "5px solid #dc2626";
} else {
    resultado.style.backgroundColor = "#ecfdf5";
    resultado.style.color = "#065f46";
    resultado.style.borderLeft = "5px solid #16a34a";
}

    resultado.style.backgroundColor = "transparent";
    resultado.style.border = "0";
    resultado.style.padding = "0";
    resultado.style.display = "block";
  }

  boton.addEventListener("click", consultarCliente);

  entrada.addEventListener("keydown", evento => {
    if (evento.key === "Enter") consultarCliente();
  });

const botonFiltrar = document.getElementById("aplicarFiltros");
const botonLimpiar = document.getElementById("limpiarFiltros");
const listaPrioritarios = document.getElementById("listaPrioritarios");
const filtrosPrioritarios = document.getElementById("filtrosPrioritarios");
const filtroSucursal = document.getElementById("filtroSucursal");
const filtroMembresia = document.getElementById("filtroMembresia");
const filtroRiesgo = document.getElementById("filtroRiesgo");
let prioritariosVisibles = false;
let paginaActual = 1;
const clientesPorPagina = 10;

function cargarOpcionesDesdeDatos(select, valores, valorInicial, textoInicial) {
  select.replaceChildren(new Option(textoInicial, valorInicial));
  [...new Set(valores.filter(Boolean))].sort().forEach(valor => {
    select.appendChild(new Option(valor, valor));
  });
}

function renderizarPrioritarios() {
  if (false) {
    listaPrioritarios.textContent =
      "Presione el botón para consultar los clientes.";
    botonFiltrar.textContent = "Filtrar clientes";
    prioritariosVisibles = false;
    return;
  }

  if (clientes.length === 0) {
    listaPrioritarios.textContent =
      "No hay datos disponibles. Verifique que el CSV se haya cargado.";
    return;
  }

  const prioritarios = clientes
    .filter(cliente => {
      const riesgo = Number(cliente.Puntaje_Riesgo) * 100;
      const coincideSucursal = filtroSucursal.value === "todas" || cliente.Sucursal === filtroSucursal.value;
      const coincideMembresia = filtroMembresia.value === "todas" || cliente.Tipo_Membresia === filtroMembresia.value;
      const coincideRiesgo = filtroRiesgo.value === "todos" ||
        (filtroRiesgo.value === "alto" && riesgo >= 70) ||
        (filtroRiesgo.value === "medio" && riesgo >= 40 && riesgo < 70) ||
        (filtroRiesgo.value === "bajo" && riesgo < 40);

      return coincideSucursal && coincideMembresia && coincideRiesgo;
    })
    .sort((a, b) =>
      Number(b.Puntaje_Riesgo) - Number(a.Puntaje_Riesgo)
    );

  const totalPaginas = Math.ceil(prioritarios.length / clientesPorPagina);
  paginaActual = Math.min(paginaActual, totalPaginas);
  const inicio = (paginaActual - 1) * clientesPorPagina;
  const primerosDiez = prioritarios.slice(inicio, inicio + clientesPorPagina);

  if (primerosDiez.length === 0) {
    listaPrioritarios.textContent =
      "No se encontraron clientes clasificados con posible cancelación.";
    return;
  }

  // Limpiar resultados anteriores.
  listaPrioritarios.replaceChildren();

  const resumen = document.createElement("p");
  resumen.textContent =
    "Clientes clasificados con posible cancelación: " +
    prioritarios.length +
    ". Se muestran los 10 con mayor puntuación estimada.";
  const posiblesCancelaciones = prioritarios.filter(cliente => Number(cliente.Prediccion_Modelo) === 1).length;
  resumen.textContent = `Clientes encontrados: ${prioritarios.length}. ${posiblesCancelaciones} presentan posible cancelación. Se muestran los 10 con mayor puntuación de riesgo.`;
  resumen.textContent += ` Página ${paginaActual} de ${totalPaginas}.`;
  listaPrioritarios.appendChild(resumen);

  const tabla = document.createElement("table");
  tabla.style.width = "100%";
  tabla.style.borderCollapse = "collapse";

  const encabezados = ["Cliente", "Sucursal", "Membresía", "Riesgo estimado"];

  const filaEncabezado = document.createElement("tr");

  encabezados.forEach(texto => {
    const celda = document.createElement("th");
    celda.textContent = texto;
    celda.style.padding = "12px";
    celda.style.backgroundColor = "#10243a";
    celda.style.color = "white";
    celda.style.textAlign = "left";
    filaEncabezado.appendChild(celda);
  });

  tabla.appendChild(filaEncabezado);

  primerosDiez.forEach((cliente, indice) => {
    const fila = document.createElement("tr");

    const valores = [
      cliente.ID_Cliente,
      cliente.Sucursal,
      cliente.Tipo_Membresia,
      (Number(cliente.Puntaje_Riesgo) * 100).toFixed(2) + "%"
    ];

    
valores.forEach((valor, indiceColumna) => {
  const celda = document.createElement("td");

  celda.style.padding = "12px";
  celda.style.borderBottom = "1px solid #e2e8f0";

  if (indiceColumna === 0) {
    const enlace = document.createElement("button");
    enlace.type = "button";
    enlace.textContent = valor;

    enlace.style.background = "none";
    enlace.style.color = "#087f68";
    enlace.style.padding = "0";
    enlace.style.margin = "0";
    enlace.style.textDecoration = "underline";
    enlace.style.fontWeight = "bold";
    enlace.style.cursor = "pointer";

    enlace.addEventListener("click", () => {
      entrada.value = cliente.ID_Cliente;
      consultarCliente();

      document.getElementById("resultado")
        .scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
    });

    celda.appendChild(enlace);
  } else {
    celda.textContent = valor;
  }

  fila.appendChild(celda);
});


    if (indice % 2 === 0) {
      fila.style.backgroundColor = "#f8fafc";
    }

    tabla.appendChild(fila);
  });

  const contenedor = document.createElement("div");
  contenedor.style.overflowX = "auto";
  contenedor.appendChild(tabla);
  listaPrioritarios.appendChild(contenedor);

  const paginacion = document.createElement("div");
  paginacion.className = "paginacion-clientes";

  const botonAnterior = document.createElement("button");
  botonAnterior.type = "button";
  botonAnterior.textContent = "Anterior";
  botonAnterior.disabled = paginaActual === 1;
  botonAnterior.addEventListener("click", () => {
    paginaActual -= 1;
    renderizarPrioritarios();
  });
  paginacion.appendChild(botonAnterior);

  const paginasVisibles = new Set([1, totalPaginas]);
  for (let numeroPagina = paginaActual - 2; numeroPagina <= paginaActual + 2; numeroPagina += 1) {
    if (numeroPagina > 0 && numeroPagina <= totalPaginas) paginasVisibles.add(numeroPagina);
  }

  let paginaAnteriorMostrada = 0;
  [...paginasVisibles].sort((a, b) => a - b).forEach(numeroPagina => {
    if (numeroPagina - paginaAnteriorMostrada > 1) {
      const puntos = document.createElement("span");
      puntos.textContent = "…";
      puntos.className = "paginacion-puntos";
      paginacion.appendChild(puntos);
    }
    const botonPagina = document.createElement("button");
    botonPagina.type = "button";
    botonPagina.textContent = numeroPagina;
    botonPagina.className = numeroPagina === paginaActual ? "pagina-activa" : "";
    botonPagina.setAttribute("aria-label", `Ir a la página ${numeroPagina}`);
    botonPagina.addEventListener("click", () => {
      paginaActual = numeroPagina;
      renderizarPrioritarios();
    });
    paginacion.appendChild(botonPagina);
    paginaAnteriorMostrada = numeroPagina;
  });

  const botonSiguiente = document.createElement("button");
  botonSiguiente.type = "button";
  botonSiguiente.textContent = "Siguiente";
  botonSiguiente.disabled = paginaActual === totalPaginas;
  botonSiguiente.addEventListener("click", () => {
    paginaActual += 1;
    renderizarPrioritarios();
  });
  paginacion.appendChild(botonSiguiente);
  listaPrioritarios.appendChild(paginacion);

  botonFiltrar.textContent = "Filtrar clientes";
  prioritariosVisibles = true;
}

function aplicarFiltros() {
  if (false) {
    listaPrioritarios.textContent = "Presione el botÃ³n para consultar los clientes.";
    filtrosPrioritarios.hidden = false;
    botonFiltrar.textContent = "Filtrar clientes";
    botonFiltrar.setAttribute("aria-expanded", "false");
    prioritariosVisibles = false;
    return;
  }

  renderizarPrioritarios();
}

[filtroSucursal, filtroMembresia, filtroRiesgo].forEach(filtro => {
  filtro.addEventListener("change", () => {
    paginaActual = 1;
    renderizarPrioritarios();
  });
});

botonFiltrar.addEventListener("click", aplicarFiltros);

botonLimpiar.addEventListener("click", () => {
  filtroSucursal.value = "todas";
  filtroMembresia.value = "todas";
  filtroRiesgo.value = "todos";
  paginaActual = 1;
  prioritariosVisibles = false;
  listaPrioritarios.textContent = "Selecciona los criterios y presiona Filtrar clientes para ver los resultados.";
  botonFiltrar.textContent = "Filtrar clientes";
});

  cargarClientes()
    .then(datos => {
      clientes = datos;
      cargarOpcionesDesdeDatos(filtroSucursal, clientes.map(cliente => cliente.Sucursal), "todas", "Todas las sucursales");
      cargarOpcionesDesdeDatos(filtroMembresia, clientes.map(cliente => cliente.Tipo_Membresia), "todas", "Todos los planes");
      console.log("Clientes cargados:", clientes.length);
    })
    .catch(error => {
      resultado.textContent = "No se pudieron cargar los datos: " + error.message;
    });
