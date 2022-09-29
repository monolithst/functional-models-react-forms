import React from 'react'
import { FunctionalModel } from 'functional-models/interfaces'
import { ReadWriteReactFormType } from '../interfaces'
import ReactForm from './ReactForm'

const ReadWriteForm = <T extends FunctionalModel>(
  props: ReadWriteReactFormType<T>
) => {
  return <ReactForm {...props} canEdit={true} />
}

export default ReadWriteForm
