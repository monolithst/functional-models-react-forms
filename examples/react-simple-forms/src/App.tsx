import React, {useEffect, useState} from 'react'
import { TextProperty, ModelReferenceProperty, ArrayProperty } from 'functional-models'
import { properties as ormProperties, orm } from 'functional-models-orm'
import createDatastore from './localStorageDatastore'
import { SaveableForm } from 'functional-models-react-forms'
import { List, ListGroupItem, Container, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap'
import {OrmModel, OrmModelInstance} from "functional-models-orm/interfaces"
import {ormQueryBuilder} from "functional-models-orm/ormQuery"

const models = Model => {
  const Species = Model('Species', {
    properties: {
      name: TextProperty({ required: true }),
      latinName: TextProperty(
        ormProperties.ormPropertyConfig<string>({
          required: true,
          unique: 'latinName',
        })
      ),
      fruitUse: ArrayProperty({
        choices: ['Fresh', 'Storage'],
      }),
    },
  })

  const RIPENING_MONTHS = {
    January: 'January',
    February: 'February',
    March: 'March',
    April: 'April',
    May: 'May',
    June: 'June',
    July: 'July',
    August: 'August',
    September: 'September',
    October: 'October',
    November: 'November',
    December: 'December',
  }

  const HarvestMonthProperty = () =>
    TextProperty({
      choices: Object.values(RIPENING_MONTHS),
    })

  const Cultivars = Model('Cultivars', {
    properties: {
      name: TextProperty({ required: true }),
      species: ModelReferenceProperty(Species, {
        required: true,
      }),
      harvestMonthEarly: HarvestMonthProperty(),
      harvestMonthLate: HarvestMonthProperty(),
    },
  })
  return {
    Species,
    Cultivars,
  }
}

const setup = () => {
  const datastoreProvider = createDatastore({})
  const theOrm = orm({ datastoreProvider })
  const theModels = models(theOrm.BaseModel)
  return {
    datastoreProvider,
    theOrm,
    theModels,
  }
}

const DropdownComponent = ({iterable, getText, onSelected}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggleDropDown = () => setDropdownOpen((prevState) => !prevState)
  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggleDropDown} direction={"down"}>
      <DropdownToggle caret>Dropdown</DropdownToggle>
      <DropdownMenu>
        <DropdownItem key={`dropdown--1`}>
          <div onClick={() => {onSelected(null)}}> </div>
        </DropdownItem>
        {
          iterable.map((obj, i) => {
            return (
              <DropdownItem key={`dropdown-${i}`}>
                <div onClick={() => {
                  onSelected(obj)
                }}>{getText(obj)}</div>
              </DropdownItem>
            )
          })
        }
      </DropdownMenu>
    </Dropdown>

  )
}

const { theModels } = setup()

type ModelListProps = {
  readonly models: readonly OrmModelInstance<any>[],
  readonly getText: (model: OrmModelInstance<any>) => string,
}

const ModelList : React.FunctionComponent<ModelListProps> = ({ models, getText }) => {
  return (
    <React.Fragment>
      <h2>List</h2>
      <List>
        {
          models.map((model, i) => {
            const text = getText(model)
            return (
              <ListGroupItem key={`model-list-${i}`}>
                {text}
              </ListGroupItem>
            )
          })
        }
      </List>
    </React.Fragment>
  )
}

function App() {
  const [model, setModel] = useState(null)
  const [modelInstances, setModelInstances] = useState<readonly OrmModelInstance<any>[]>([])
  const [modelData, setModelData] = useState({})
  useEffect(() => {
    if (model) {
      (model as OrmModel<any>).search(ormQueryBuilder().compile()).then(result => {
        if (modelInstances.length === 0 && result.instances.length === 0) {
          return
        }
        if (modelInstances.length > 0) {
          if (modelInstances.length === result.instances.length && modelInstances[0].getModel().getName() === (model as OrmModel<any>).getName()) {
            return
          }
        }
        result.instances.map(x=>x.toObj().then(console.log))
        setModelInstances(result.instances)
      })
    } else {
      console.log(3)
      if (modelInstances.length === 0) {
        return
      }
      setModelInstances([])
    }
  }, [ model, modelInstances])
  return (
    <div className="App">
      <Container>
        <DropdownComponent iterable={Object.keys(theModels)} getText={(key) => key} onSelected={(key) => setModel(theModels[key])} />
        {
          model
            ? (
              <SaveableForm
                model={model}
                canEdit={true}
                modelData={modelData}
                onSubmit={(x) => {
                  x.save().then(y=>{
                    setModelInstances([...modelInstances, x])
                    y.toObj()
                      .then(x => {
                        console.log(x)
                        return x
                      })
                      .then(() => {
                        console.log("SETTING MODEL DATA")
                        setModelData({})
                      })
                  })
                    .catch(e => {
                      console.log(e)

                    })
                }
                }
              />
            )
            : <React.Fragment />
        }
        <ModelList models={modelInstances} getText={(x) => `${x.get.name()} - ${x.get.latinName()}`} />
      </Container>
    </div>
  )
}

export default App
