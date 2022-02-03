export function capitalize(string: string) {
  if (!string) return string
  return string[0].toUpperCase() + string.substring(1)
}

export function isCharacterALetter(char: string) {
  return /[a-zA-Z]/.test(char)
}
