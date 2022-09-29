import React, { useState, useEffect } from 'react'
import merge from 'lodash/merge'
import { mapLimit } from 'modern-async'
import { validation as fmValidation } from 'functional-models'
import { validation as ormValidation } from 'functional-models-orm'
import {
  FunctionalModel,
  CreateParams,
  ModelErrors,
  PropertyInstance,
} from 'functional-models/interfaces'
import { OrmModel, OrmModelInstance } from 'functional-models-orm/interfaces'
import { Form, Button } from 'reactstrap'
import omit from "lodash/omit"
import { getFieldForProperty } from '../fields'
import { ValueChangedEvent, ReactFormType } from '../interfaces'
import { DEFAULT_MAX_ASYNC_CALLS } from '../constants'
import MaybeComponent from './MaybeComponent'
import { isOk } from '../utils'

const ReactForm = <T extends FunctionalModel>({
  model,
  canEdit = true,
  onSubmit = undefined,
  onDelete = undefined,
  onCancel = undefined,
  modelData = undefined,
  fieldOverrides = {},
  formErrors = undefined,
  fieldGetter = getFieldForProperty(),
  maxAsyncCalls = DEFAULT_MAX_ASYNC_CALLS,
}: ReactFormType<T>) => {
  const [isFirst, setIsFirst] = useState<boolean>(true)
  const [modelInstance, setModelInstance] = useState<
    OrmModelInstance<T, OrmModel<T>>
  >(model.create(modelData || ({} as CreateParams<T>)))
  const [valid, setValid] = useState<boolean>(false)
  const [fields, setFields] = useState<readonly any[]>([])
  const [errors, setErrors] = useState<ModelErrors<T, OrmModel<T>>>(
    formErrors || ({} as ModelErrors<T, OrmModel<T>>)
  )
  const validationOptions = ormValidation.buildOrmValidationOptions({
    noOrmValidation: true,
  })
  const _validate = (model: OrmModelInstance<T>) => {
    model
      .validate(validationOptions)
      .then((errors: ModelErrors<T, OrmModel<T>>) => {
        setErrors(errors)
        const isValid = Object.keys(errors).length < 1
        if (valid !== fmValidation.isValid(errors)) {
          setValid(isValid)
        }
      })
  }

  const onValueChanged =
    ({ key }: { readonly key: string }): ValueChangedEvent =>
    value => {
      modelInstance.toObj().then(x => {
        const newData = merge(omit(x, [key]), { [key]: value })
        // @ts-ignore
        const newModel = model.create(newData)
        setModelInstance(newModel)
        _validate(newModel)
      })
    }

  useEffect(() => {
    (async () => {
      if (modelInstance && modelInstance.getModel().getName() !== model.getName() ) {
        setModelInstance(model.create({} as CreateParams<T>))
        return
      }
      const fields = await mapLimit(
        Object.entries(model.getModelDefinition().properties),
        async ([key, property], i) => {
          const field =
            key in fieldOverrides
              ? fieldOverrides[key]
              : fieldGetter(property as PropertyInstance<any>)

          // @ts-ignore
          const value = await modelInstance.get[key]()
          const errorsToUse = merge({}, formErrors, errors) as {
            readonly [s: string]: readonly string[] | undefined
          }
          const fieldErrors = errorsToUse[key] || []
          const fieldValid = fieldErrors.length < 1

          return field.create({
            key: `model-field-${key}-${i}`,
            propertyKey: key,
            disabled: !canEdit,
            value,
            errors: isFirst ? [] : fieldErrors,
            valid: isFirst ? true : fieldValid,
            property: property as PropertyInstance<any>,
            onValueChanged: onValueChanged({ key }),
          })
        },
        maxAsyncCalls
      )
      setFields(fields)
      setIsFirst(false)
    })()
    return
  }, [model, modelInstance, errors, formErrors])

  const overallErrors = errors.overall || []
  return (
    <Form>
      <React.Fragment>
        <ul color={'danger'}>
          {overallErrors.map((e: any) => (
            <li key={`overall-${e}`}>{e}</li>
          ))}
        </ul>
        {fields}
        <MaybeComponent shouldShow={onCancel}>
          <Button size={'lg'} color={'warning'} onClick={() => isOk(onCancel) ? onCancel() : {}}>
            Cancel
          </Button>
        </MaybeComponent>
        <MaybeComponent shouldShow={onDelete}>
          <Button
            size={'lg'}
            color={'danger'}
            onClick={() => isOk(onDelete) ? onDelete(modelInstance) : {}}
          >
            Delete
          </Button>
        </MaybeComponent>
        <MaybeComponent shouldShow={canEdit}>
          <Button
            disabled={!valid}
            size={'lg'}
            color={'primary'}
            onClick={() => isOk(onSubmit) ? onSubmit(modelInstance) : {}}
          >
            Submit
          </Button>
        </MaybeComponent>
      </React.Fragment>
    </Form>
  )
}

export default ReactForm
