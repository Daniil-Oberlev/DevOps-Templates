export const getCopyright = (year: number = new Date().getFullYear()): string => {
  return `Copyright \u00A9 ${year} Daniil Oberlev`
}
