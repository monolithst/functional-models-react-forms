import React from 'react'
import { FunctionalModel } from 'functional-models/interfaces'
import { ReactFormType } from '../interfaces'
import ReactForm from './ReactForm'

const ReadonlyForm = <T extends FunctionalModel>(props: ReactFormType<T>) => {
  return <ReactForm {...props} canEdit={false} />
}

export default ReadonlyForm
