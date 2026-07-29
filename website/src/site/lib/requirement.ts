/**
 * Cross-section interlinking.
 *
 * Any card anywhere on the page can send the visitor to the booking form with
 * their requirement already chosen. The anchor still works without JavaScript —
 * this only enriches the hand-off.
 */
export const REQUIREMENT_EVENT = "aurum:requirement";

export function setRequirement(value: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<string>(REQUIREMENT_EVENT, { detail: value }));
}

export function onRequirement(handler: (value: string) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<string>).detail);
  window.addEventListener(REQUIREMENT_EVENT, listener);
  return () => window.removeEventListener(REQUIREMENT_EVENT, listener);
}
