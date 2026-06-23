/** Evento DOM tras COBRAR exitoso — fuerza refresh /live sin esperar poll. */
export const POS_COBRAR_OK_EVENT = "tablet:pos-cobrar-ok";

export function dispatchPosCobrarOk(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(POS_COBRAR_OK_EVENT));
}
