import { Dispatch } from 'react'
import { ACTIONS } from '../App'

type OperationButtonProps = {
  dispatch: Dispatch<{type: ACTIONS.CHOOSE_OPERATION; payload: string}>;
  operation: string;
}

const OperationButton = ({ dispatch, operation }: OperationButtonProps) => {
  const handleClick = (): void => {
    dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: operation });
  }
  return <button onClick={handleClick}>{ operation }</button>;
} 

export default OperationButton;


