import { InputProps } from 'reactstrap'
import React from 'react'
import {
  CreateParams,
  FunctionalModel,
  ModelErrors,
  PropertyInstance,
} from 'functional-models/interfaces'
import { OrmModel, OrmModelInstance } from 'functional-models-orm/interfaces'

type ValueChangedEvent = (value: any) => void
type FieldFactoryProps = {
  readonly propertyType: string
  readonly props?: InputProps
  readonly hidden?: boolean
  readonly isCheckbox?: boolean
  readonly input?: FMInput
}

type FieldInstance = React.FunctionComponent<FieldProps>

type Field = {
  readonly create: FieldInstance
  readonly getHidden: () => boolean
  readonly getPropertyType: () => string
}

type FieldInputProps = {
  readonly property: PropertyInstance<any>
  readonly disabled: boolean
  readonly props?: InputProps
  readonly value: any
  readonly valid: boolean
  readonly onValueChanged: (value: any) => void
}

type FieldProps = {
  readonly property: PropertyInstance<any>
  readonly disabled: boolean
  readonly key: string
  readonly propertyKey: string
  readonly errors: readonly string[]
  readonly value: any
  readonly valid: boolean
  readonly onValueChanged: (value: any) => void
}

type FMInput = {
  readonly create: React.FunctionComponent<FieldInputProps>
}

type FMInputFactory = () => FMInput

type FieldOverrides = {
  readonly [propertyName: string]: Field
}

type FieldGetter = (property: PropertyInstance<any>) => Field

type ReactFormType<T extends FunctionalModel> = {
  readonly model: OrmModel<T>
  readonly modelData?: CreateParams<T>
  readonly canEdit?: boolean
  readonly onSubmit?: (instance: OrmModelInstance<T>) => void
  readonly onDelete?: (instance: OrmModelInstance<T>) => void
  readonly onCancel?: () => void
  readonly formErrors?: ModelErrors<T, OrmModel<T>>
  readonly fieldOverrides?: FieldOverrides
  readonly fieldGetter?: FieldGetter
  readonly maxAsyncCalls?: number
}

type ReadWriteReactFormType<T extends FunctionalModel> = ReactFormType<T> & {
  readonly onSubmit: (instance: OrmModelInstance<T>) => void
  readonly onDelete: (instance: OrmModelInstance<T>) => void
  readonly onCancel: () => void
}

export {
  ValueChangedEvent,
  FieldFactoryProps,
  Field,
  FieldInputProps,
  FieldProps,
  FMInput,
  FMInputFactory,
  FieldOverrides,
  FieldGetter,
  FieldInstance,
  ReactFormType,
  ReadWriteReactFormType,
}
