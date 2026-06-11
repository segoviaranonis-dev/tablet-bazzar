import { buildCadenaFromFilas } from "../lib/cadena.ts";

const filas = [
  {
    linea_id: 1,
    referencia_id: 1,
    material_id: 1,
    color_id: 1,
    marca_id: 1,
    linea_codigo_proveedor: " 1184 ",
    referencia_codigo_proveedor: " 1101 ",
    material_code: " 100 ",
    color_code: " 1 ",
    marca: "VIZZANO",
    genero: "Damas",
    estilo: "CHATITA",
    tipo_v2: "CALZ",
    descp_material: null,
    descp_color: null,
    grada: "g",
    cantidad: 5,
    imagen_nombre: null,
  },
];

console.log("trim keys:", buildCadenaFromFilas(filas, "VIZZANO").length);
console.log("marca with spaces:", buildCadenaFromFilas(filas, " VIZZANO ").length);
const f2 = { ...filas[0], marca: " VIZZANO " };
console.log("f.marca spaces strict:", buildCadenaFromFilas([f2], "VIZZANO").length);
