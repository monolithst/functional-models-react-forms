import React, { useState } from 'react'
import {CreateParams, FunctionalModel, ModelErrors, MaybePromise} from 'functional-models/interfaces'
import {OrmModel, OrmModelInstance, } from "functional-models-orm/interfaces"
import {FieldGetter, FieldOverrides} from '../interfaces'
import ReadWriteForm from "./ReadWriteForm"

type SaveableFormType<T extends FunctionalModel> = {
  readonly model: OrmModel<T>
  readonly modelData?: CreateParams<T>
  readonly onSubmit?: (instance: OrmModelInstance<T>) => MaybePromise<void>
  readonly onDelete?: (instance: OrmModelInstance<T>) => MaybePromise<void>
  readonly onCancel?: () => void
  readonly fieldOverrides?: FieldOverrides
  readonly fieldGetter?: FieldGetter
  readonly maxAsyncCalls?: number
}

const SaveableForm = <T extends FunctionalModel>(
  props: SaveableFormType<T>,
) => {
  const [theModelData, setModelData] = useState<CreateParams<T>>(((props.modelData || {}) as CreateParams<T>))

  const _clearForm = () => {
    console.log("CLEAING FORM")
    setModelData({} as CreateParams<T>)
  }

  return (
    <ReadWriteForm {...props}
      modelData={theModelData}
      onCancel={() => {
        _clearForm()
      }}
      onSubmit={(x: OrmModelInstance<T>) => {
        return x.save()
          .then((saved: OrmModelInstance<T>) => {
            _clearForm()
            if (props.onSubmit) {
              return props.onSubmit(saved)
            }
          })
      }}
      onDelete={(x: OrmModelInstance<T>) => {
        return x.delete()
          .then(() => {
            _clearForm()
            if (props.onDelete) {
              return props.onDelete(x)
            }
          })
      }}
      canEdit={true}
    />
  )
}

export default SaveableForm
