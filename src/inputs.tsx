import React from 'react'
import merge from 'lodash/merge'
import { Input, InputProps } from 'reactstrap'
import {PROPERTY_TYPES} from "functional-models/constants"
import { FieldInputProps, FMInputFactory } from './interfaces'

const BooleanInput: FMInputFactory = () => {
  const create: React.FunctionComponent<FieldInputProps> = ({
    props = {},
    disabled,
    value,
    valid,
    onValueChanged,
  }) => {
    const allProps: InputProps = merge(
      {},
      {
        disabled: disabled,
        invalid: !valid,
        onChange: (e: any) => onValueChanged(e.target.value === 'true'),
        value,
        type: 'checkbox',
      },
      props
    )
    return <Input {...allProps} />
  }
  return {
    create,
  }
}

const MutliSelectInput: FMInputFactory = () => {
  const create: React.FunctionComponent<FieldInputProps> = ({
    props = {},
    property,
    disabled,
    value,
    valid,
    onValueChanged,
  }) => {
    const defaultValue = property.getDefaultValue() || []
    value = (value ? value : defaultValue) || []

    const allProps: InputProps = merge(
      {},
      {
        disabled: disabled,
        invalid: !valid,
        onChange: (e: any) => {
          const selected = [...e.target.options].filter((x: any) => {
            if (x.value === e.target.value) {
              return x.selected
            } else {
              return x.selected
            }
          }).map((x: any) => x.value)
          onValueChanged([...selected])
        },
        value,
        type: 'select',
        multiple: 'multiple',
      },
      props
    )

    return (
      <Input {...allProps}>
        {property.getChoices().map((x: any) => (
          <option key={`choice-${x}`}>{x}</option>
        ))}
      </Input>
    )
  }
  return {
    create,
  }
}

const SelectInput: FMInputFactory = () => {
  const create: React.FunctionComponent<FieldInputProps> = ({
    props = {},
    property,
    disabled,
    value,
    valid,
    onValueChanged,
  }) => {
    const defaultValue = property.getDefaultValue() || ''
    const rawChoices = property.getChoices()
    // @ts-ignore
    const noEmpty = property.getConfig().required
    const choices = (defaultValue !== undefined && rawChoices.includes(defaultValue) === false
        ? [defaultValue, ...rawChoices]
        : (rawChoices as readonly any[])
      ).filter(choice => {
        if (noEmpty && !choice){
          return false
        }
        return true
      })
    value = value ? value : defaultValue

    const allProps: InputProps = merge(
      {},
      {
        disabled: disabled,
        invalid: !valid,
        onChange: (e: any) => {
          onValueChanged(e.target.value)
        },
        value,
        type: 'select',
      },
      props
    )

    return (
      <Input {...allProps}>
        {choices.map((x: any) => (
          <option key={`choice-${x}`}>{x}</option>
        ))}
      </Input>
    )
  }
  return {
    create,
  }
}

const TextInput: FMInputFactory = () => {
  const create: React.FunctionComponent<FieldInputProps> = ({
    props = {},
    property,
    disabled,
    value,
    valid,
    onValueChanged,
  }) => {
    if (property.getChoices().length > 0) {
      const theInput = property.getPropertyType() === PROPERTY_TYPES.ArrayProperty
        ? MutliSelectInput()
        : SelectInput()
      return theInput.create({
        props,
        property,
        disabled,
        value,
        valid,
        onValueChanged,
      })
    }

    const constantValue = property.getConstantValue() || null
    const defaultValue = property.getDefaultValue() || ''
    value = constantValue
      ? constantValue
      : value !== undefined && value !== null
      ? value
      : defaultValue

    const allProps = merge(
      {},
      {
        disabled: constantValue ? true : disabled,
        invalid: !valid,
        onChange: (e: any) => {
          onValueChanged(e.target.value)
        },
        value,
        type: 'text',
      },
      props
    )

    return <Input {...allProps} />
  }
  return {
    create,
  }
}

export { TextInput, BooleanInput, SelectInput }
