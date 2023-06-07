import { Dispatch } from 'react'
import { ACTIONS } from '../App'

type DigitButtonProps = {
  dispatch: Dispatch<{type: ACTIONS.ADD_DIGIT; payload: string}>;
  digit: string;
}

const DigitButton = ({ dispatch, digit }: DigitButtonProps) => {
  const handleClick = (): void => {
    dispatch({type: ACTIONS.ADD_DIGIT, payload: digit})
  }
  return <button onClick={handleClick}>{digit}</button>;
} 

export default DigitButton;


