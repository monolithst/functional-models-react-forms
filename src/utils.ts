import startCase from 'lodash/startCase'
import camelCase from 'lodash/camelCase'

const titleCase = (text: string) => {
  return startCase(camelCase(text))
}

const isOk = (value: any) : value is boolean => {
  return Boolean(value)
}

export {
  titleCase,
  isOk
}
