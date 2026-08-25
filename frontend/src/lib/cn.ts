/**
 * Combina classes condicionalmente sem depender de clsx/tailwind-merge.
 * Suficiente para este projeto: apenas concatena valores truthy.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
