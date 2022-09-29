import merge from 'lodash/merge'
import { datastore } from 'functional-models-orm'

const localStorageDatastore = (seedModels = {}) => {
  const fromLocal = localStorage.getItem('react-simple-forms')
  seedModels = fromLocal ? JSON.parse(fromLocal) : seedModels
  const memoryStore = datastore.memory.default(seedModels, {
    onDbChanged: db => {
      const data = Object.entries(db).reduce((acc, [key, values]) => {
        const valueArray = Object.values(values)
        if (key in acc) {
          return merge(acc, {[key]: acc[key].concat(valueArray)})
        }
        return merge(acc, {[key]: valueArray})
      }, {})
      localStorage.setItem('react-simple-forms', JSON.stringify(data))
    },
  })
  const save = (...args) => {
    return memoryStore.save(...args)
  }
  const deleteObj = (...args) => {
    return memoryStore.delete(...args)
  }
  const retrieve = (...args) => {
    return memoryStore.retrieve(...args)
  }
  const search = (...args) => {
    return memoryStore.search(...args)
  }
  return {
    save,
    delete: deleteObj,
    retrieve,
    search,
  }
}

export default localStorageDatastore
