import React from 'react'
import { FormGroup, Label, FormFeedback } from 'reactstrap'
import { constants } from 'functional-models'
import { constants as authConstants } from 'functional-models-auth'
import { titleCase } from './utils'
import { FieldFactoryProps, Field, FieldProps, FieldGetter } from './interfaces'
import { TextInput, BooleanInput } from './inputs'

const PROPERTY_TYPES = {
  ...constants.PROPERTY_TYPES,
  ...authConstants.PropertyTypes,
}

const Fields = ({
  propertyType,
  input = TextInput(),
  props,
  hidden = false,
  isCheckbox = false,
}: FieldFactoryProps): Field => {
  const create: React.FunctionComponent<FieldProps> = ({
    disabled = false,
    key,
    propertyKey,
    property,
    value,
    valid,
    errors,
    onValueChanged,
  }) => {
    const inputInstance = input.create({
      property,
      disabled,
      value,
      valid,
      onValueChanged,
      props,
    })
    return (
      <FormGroup key={key} hidden={hidden} checked={isCheckbox}>
        <React.Fragment>
          <Label check={isCheckbox}>
            {!isCheckbox ? titleCase(propertyKey) : ' '}
          </Label>
          {inputInstance}
          {isCheckbox ? ` ${titleCase(propertyKey)}` : <React.Fragment />}
          <FormFeedback>{errors.join('; ')}</FormFeedback>
        </React.Fragment>
      </FormGroup>
    )
  }

  return {
    getPropertyType: () => {
      return propertyType
    },
    getHidden: () => hidden,
    create,
  }
}

const UniqueIdField = Fields({
  propertyType: PROPERTY_TYPES.UniqueId,
  hidden: true,
})

const TextField = Fields({
  propertyType: PROPERTY_TYPES.TextProperty,
})

const PasswordField = Fields({
  propertyType: PROPERTY_TYPES.PasswordProperty,
  props: {
    type: 'password',
  },
})

const BooleanField = Fields({
  propertyType: PROPERTY_TYPES.BooleanProperty,
  input: BooleanInput(),
  isCheckbox: false,
})

const EmailField = Fields({
  propertyType: PROPERTY_TYPES.EmailProperty,
  props: {
    type: 'email',
  },
})

const DateField = Fields({
  propertyType: PROPERTY_TYPES.DateProperty,
  props: {
    type: 'datetime',
  },
})

const ArrayField = Fields({
  propertyType: PROPERTY_TYPES.ArrayProperty,
})

const IntegerField = Fields({
  propertyType: PROPERTY_TYPES.IntegerProperty,
  props: {
    type: 'number',
  },
})

const NumberField = Fields({
  propertyType: PROPERTY_TYPES.NumberProperty,
  props: {
    type: 'number',
  },
})

const ObjectField = Fields({
  propertyType: PROPERTY_TYPES.ObjectProperty,
})

const ReferenceField = Fields({
  propertyType: PROPERTY_TYPES.ReferenceProperty,
})

const FieldsList = [
  UniqueIdField,
  PasswordField,
  ReferenceField,
  ObjectField,
  NumberField,
  IntegerField,
  ArrayField,
  DateField,
  EmailField,
  BooleanField,
  TextField,
]

const _defaultTypeToField: { readonly [s: string]: Field } = {}
const _typeToField = FieldsList.reduce(
  (acc, item) => ({ ...acc, [item.getPropertyType()]: item }),
  _defaultTypeToField
)

const getFieldForProperty =
  (overrides: { readonly [s: string]: Field } = {}): FieldGetter =>
  property => {
    const type = property.getPropertyType()
    const field = overrides[type] ? overrides[type] : _typeToField[type]
    return field ? field : TextField
  }

export {
  Fields,
  getFieldForProperty,
  UniqueIdField,
  ReferenceField,
  ObjectField,
  NumberField,
  IntegerField,
  ArrayField,
  DateField,
  EmailField,
  BooleanField,
  TextField,
}
