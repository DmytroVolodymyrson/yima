const transliterate = (cyrillicText: string) => {
  return cyrillicText
    .replaceAll('Ё', 'Yo')
    .replaceAll('Й', 'I')
    .replaceAll('Ц', 'Ts')
    .replaceAll('У', 'U')
    .replaceAll('К', 'K')
    .replaceAll('Е', 'E')
    .replaceAll('Н', 'N')
    .replaceAll('Г', 'G')
    .replaceAll('Ш', 'Sh')
    .replaceAll('Щ', 'Sch')
    .replaceAll('З', 'Z')
    .replaceAll('Х', 'H')
    .replaceAll('Ъ', '')
    .replaceAll('ё', 'yo')
    .replaceAll('й', 'i')
    .replaceAll('ц', 'ts')
    .replaceAll('у', 'u')
    .replaceAll('к', 'k')
    .replaceAll('е', 'e')
    .replaceAll('н', 'n')
    .replaceAll('г', 'g')
    .replaceAll('ш', 'sh')
    .replaceAll('щ', 'sch')
    .replaceAll('з', 'z')
    .replaceAll('х', 'h')
    .replaceAll('ъ', "'")
    .replaceAll('Ф', 'F')
    .replaceAll('Ы', 'I')
    .replaceAll('В', 'V')
    .replaceAll('А', 'a')
    .replaceAll('П', 'P')
    .replaceAll('Р', 'R')
    .replaceAll('О', 'O')
    .replaceAll('Л', 'L')
    .replaceAll('Д', 'D')
    .replaceAll('Ж', 'Zh')
    .replaceAll('Э', 'E')
    .replaceAll('ф', 'f')
    .replaceAll('ы', 'i')
    .replaceAll('в', 'v')
    .replaceAll('а', 'a')
    .replaceAll('п', 'p')
    .replaceAll('р', 'r')
    .replaceAll('о', 'o')
    .replaceAll('л', 'l')
    .replaceAll('д', 'd')
    .replaceAll('ж', 'zh')
    .replaceAll('э', 'e')
    .replaceAll('Я', 'Ya')
    .replaceAll('Ч', 'CH')
    .replaceAll('С', 'S')
    .replaceAll('М', 'M')
    .replaceAll('И', 'I')
    .replaceAll('Т', 'T')
    .replaceAll('Ь', "'")
    .replaceAll('Б', 'B')
    .replaceAll('Ю', 'Yu')
    .replaceAll('я', 'ya')
    .replaceAll('ч', 'ch')
    .replaceAll('с', 's')
    .replaceAll('м', 'm')
    .replaceAll('и', 'i')
    .replaceAll('т', 't')
    .replaceAll('ь', "'")
    .replaceAll('б', 'b')
    .replaceAll('ю', 'yu')
    .replaceAll('ї', 'i')
    .replaceAll('і', 'i')
    .replaceAll('є', 'e')
    .replaceAll('ґ', 'g')
    .replaceAll('Ї', 'I')
    .replaceAll('І', 'I')
    .replaceAll('Є', 'E')
    .replaceAll('Ґ', 'G')
    .replaceAll('/', '-')
    .replaceAll('%', '')
    .replaceAll('`', '')
    .replaceAll("'", '')
    .replaceAll('(', '')
    .replaceAll(')', '')
    .replaceAll(',', '-')
    .replaceAll(':', '-')
    .replaceAll('\\', '-')
    .replaceAll('*', '-')
    .replaceAll('"', '')
    .replaceAll('ʼ', '')
    .replaceAll("'", '')
    .replaceAll('+', '-')
    .replaceAll('=', '-')
    .replaceAll('&', '-')
    .replaceAll('?', '-')
    .replaceAll('#', '-')
    .replaceAll('@', '-')
    .replaceAll('!', '-')
    .replaceAll('$', '-')
    .replaceAll('^', '-')
    .replaceAll(';', '-')
    .replaceAll('~', '-')
    .replaceAll('|', '-')
    .replaceAll('[', '-')
    .replaceAll(']', '-')
    .replaceAll('{', '-')
    .replaceAll('}', '-')
    .replaceAll('<', '-')
    .replaceAll('>', '-')
    .replaceAll('.', '-')
}

const getUnixDate = (date?: Date) => {
  const finalDate = date?.getTime() ?? Date.now()

  return Math.floor(finalDate / 1000)
}

const getDateStringFromUnix = (unixDate: number) => {
  const dateObject = new Date(unixDate * 1000)

  return dateObject.toLocaleString('uk-UA', { timeStyle: 'short', dateStyle: 'short' })
}

export const useYimaUtils = () => {
  return {
    getDateStringFromUnix,
    getUnixDate,
    transliterate,
  }
}
