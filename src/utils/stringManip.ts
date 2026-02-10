function snakeCaseToWords(s: string) {
  return s
    .replace (/^[-_]*(.)/, (_, c) => c.toUpperCase())
    .replace (/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase())
}

function wordsToSnakeCase(s: string) {
  return s
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[A-Z]/g, c => c.toLowerCase());
}

export { snakeCaseToWords, wordsToSnakeCase };