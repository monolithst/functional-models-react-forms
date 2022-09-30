import React from 'react'

type MaybeComponentProps = {
  readonly shouldShow: any,
  readonly children: JSX.Element,
}

const MaybeComponent : React.FunctionComponent<MaybeComponentProps> = ({ shouldShow, children}) => {
  return (
    shouldShow
      ? <React.Fragment>{ children }</React.Fragment>
      : <React.Fragment />
  )
}

export default MaybeComponent
