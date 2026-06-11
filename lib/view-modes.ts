/** Modos de vista registrados en Tablet Bazzar (extensible). */
export type ViewMode = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  enabled: boolean;
};

export const VIEW_MODES: ViewMode[] = [
  {
    id: "deposito-fotos",
    title: "Depósito con fotos",
    description: "Stock del depósito de tienda · grid touch · imágenes producto",
    href: "/deposito",
    icon: "🏪",
    enabled: true,
  },
  {
    id: "cadena-consecutiva",
    title: "Cadena consecutiva",
    description: "Marca → L+R en cadena · foto grande · colores grupo 1 y 2 · búsqueda por código",
    href: "/cadena",
    icon: "👟",
    enabled: true,
  },
];

export function getViewMode(id: string): ViewMode | undefined {
  return VIEW_MODES.find((m) => m.id === id);
}
