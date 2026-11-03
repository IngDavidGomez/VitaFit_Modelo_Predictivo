const CSV_PATH = "VitaFit_Resultados_Prueba.csv";

export async function cargarClientes() {
  const respuesta = await fetch(CSV_PATH);

  if (!respuesta.ok) {
    throw new Error("No se pudo abrir el archivo CSV.");
  }

  const texto = await respuesta.text();
  const lineas = texto.trim().split(/\r?\n/);

  if (lineas.length === 0 || !lineas[0]) {
    return [];
  }

  const encabezados = lineas[0]
    .replace(/^\uFEFF/, "")
    .split(",")
    .map(columna => columna.trim());

  function separarCampos(linea) {
    const campos = [];
    let campo = "";
    let entreComillas = false;

    for (let indice = 0; indice < linea.length; indice += 1) {
      const caracter = linea[indice];

      if (caracter === '"' && linea[indice + 1] === '"' && entreComillas) {
        campo += '"';
        indice += 1;
      } else if (caracter === '"') {
        entreComillas = !entreComillas;
      } else if (caracter === "," && !entreComillas) {
        campos.push(campo.trim());
        campo = "";
      } else {
        campo += caracter;
      }
    }

    campos.push(campo.trim());
    return campos;
  }

  return lineas.slice(1).filter(Boolean).map(linea => {
    const valores = separarCampos(linea);
    return encabezados.reduce((cliente, columna, indice) => {
      cliente[columna] = valores[indice]?.trim() ?? "";
      return cliente;
    }, {});
  });
}
