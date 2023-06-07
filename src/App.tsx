import './App.css'
import DigitButton from './components/digitButton';
import OperationButton from './components/operationButton'
import { useReducer } from 'react';

// describe the shape or structure of the Object
interface State {
    prevOperand?: string,
    currentOperand?: string,
    operation?: string,
    overwrite?: boolean
}

// InitialState of our useReducer hook annotated using the State interface
const initialState: State = {
    prevOperand: "",
    currentOperand: "",
    operation: ""
}

// Defines the action types using enum, since they are all related values
export enum ACTIONS {
    ADD_DIGIT = 'add-digit',
    CHOOSE_OPERATION = 'choose-operation',
    CLEAR = 'clear',
    DELETE_DIGIT = 'delete-digit',
    EVALUATE = 'evaluate'
}

// annotating the action types using the type keyword from typescript, type is similar to interface
// 
type ACTIONTYPE = 
              | { type: ACTIONS.ADD_DIGIT; payload: string }
              | { type: ACTIONS.CLEAR; }
              | { type: ACTIONS.EVALUATE; }
              | { type: ACTIONS.DELETE_DIGIT; }
              | { type: ACTIONS.CHOOSE_OPERATION; payload: string }
              
//The reducer function takes in two parameters, the current state of our app, and the action(type, payload)
function reducer(state: typeof initialState, action: ACTIONTYPE) {
    switch(action.type) {

        case ACTIONS.ADD_DIGIT:
          if(state.overwrite) {
            return {
              ...state,
              /* after clicking on the equals sign, the overwrite value changes to true
              so when a user clicks on any digits it overwrites the evaluated digit with the digit that the user clicked */
              currentOperand: action.payload, 
              overwrite: false
            }
          }
          //If you type zero or the current operand is zero, then don't another zero
          if(action.payload === "0" && state.currentOperand === "0") return state; 
          //If you type a period or the current operand includes a period, then don't another period
          if(action.payload === "." && state.currentOperand?.includes(".")) return state;
            return {
                ...state,
                //adds the payload value to the current operand value as a string
                currentOperand: `${state.currentOperand || ""}${action.payload}`,
            };
         
        case ACTIONS.CHOOSE_OPERATION:
          // if the current operand and previous operand are empty, then do nothing
          if(state.currentOperand === "" && state.prevOperand === "") { 
            return state;
          }

          /* if the current operand is empty and there is probably previous operand value and operation value,
          this if statement overwrites the current operation with the operation that the user clicked */ 
          if(state.currentOperand === "") {
            return {
              ...state,
              operation: action.payload,
            }
          }

          /* if the previous operand is empty, the current operand possibly contains a value,
          so clicking on an operation sets the previous operand to the current operand, and the current operand becomes empty */
          if(state.prevOperand === "") {
            return {
              ...state,
              prevOperand: state.currentOperand,
              operation: action.payload,
              currentOperand: ""
            }
          }

          /* clicking on the equals button sets the overwrite value to true. When an operation is clicked the evaluated figure (current operand) 
          becomes the previous operand and the current operand is set to empty */
          if(state.overwrite) {
            return {
              ...state,
              operation: action.payload,
              prevOperand: state.currentOperand,
              currentOperand: "",
              overwrite: false
            }
          }

          /** When the previous operand, current operand and the operation all have values, then clicking on an operation should
           * evaluate the current and previous operands, e.g, ( prev - current ), then clicking on an operation calculates it
           */
          return {
            ...state,
            prevOperand: evaluate(state),
            operation: action.payload,
            currentOperand: ""
          }

        case ACTIONS.CLEAR: 
        // When the clear button is clicked, return the initial state
          return {
            ...state,
              prevOperand: "",
              currentOperand: "",
              operation: ""
          }

          /** if the overwrite state is true, the clear the current operand */
        case ACTIONS.DELETE_DIGIT: 
          if(state.overwrite) {
            return  {
              ...state,
              currentOperand: "",
              overwrite: false
            }
          }

          //if the current operand is empty, then do nothing
          if (state.currentOperand === "") return state
          // if the length of the current operand is 1 then return an empty string
          if (state.currentOperand?.length === 1 ) {
            return {
              ...state, 
              currentOperand: "",
            }
          }

          return {
            ...state,
            currentOperand:  state.currentOperand?.slice(0, -1) // removes the last digit from the currentOperand
          }

          // if all operations are empty, do nothing
        case ACTIONS.EVALUATE:
          if(state.currentOperand === "" || state.prevOperand === "" || state.operation === "") {
            return state;
          }

          /** else if they are not, the evaluate function is called on the current operand, and the overwrite property
           * is set to true, the prevOperand and currentOperand are set to an empty string
           */
          return {
            ...state,
            overwrite: true,
            prevOperand: "",
            currentOperand: evaluate(state),
            operation: ""
          }
        default:
            return state;
    }
}


function evaluate({ currentOperand, prevOperand, operation }: State): string {
  //convert the string values to number using the parseFloat method
  const prev = parseFloat(prevOperand || '')
  const current = parseFloat(currentOperand || '');

  //if the prev and current variables are empty, return an empty string
  if(isNaN(prev) || isNaN(current)) return ""

  //define a variable and initialize it with 0
  let computation = 0;
  switch (operation) {
    case "+":
      computation = prev + current
      break;
    case '-':
      computation = prev - current
      break;
    case "*":
      computation = prev * current
      break;
    case "÷":
      computation = prev / current;
      break;
  }

  // returns the computation value but converts it back to a string
  return computation.toString();
}

//The Intl.NumberFormat object enables language-sensitive number formatting
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0, // Make sure there are no fractions, rounds to the nearest whole number
});

function formatOperand(operand?: string) {
  //if the operand is null, undefined or empty, then return an empty string
  if (operand === null || operand === undefined || operand === "") return "";
  //This next line splits the string into an array of two values.
  const [integer, decimal] = (operand || "").split(".")
  //if the operand does not include the decimal portion, which means the decimal is undefined
  // then format the integer 
  if (decimal === undefined) return INTEGER_FORMATTER.format(parseInt(integer));
  //else format both the integer and the decimal
  return `${INTEGER_FORMATTER.format(parseInt(integer))}.${decimal}`;
}
function App() {
  const [ {prevOperand, currentOperand, operation}, dispatch ] = useReducer(reducer, initialState)
  return (
    <div className='calculator-grid'>
      <div className="counter">
            <div className="prev-operand">{formatOperand(prevOperand)} {operation}</div>
            <div className="current-operand">{formatOperand(currentOperand)}</div>
        </div>
      <button className='span-two' onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation='÷' dispatch={dispatch}/>
      <DigitButton digit='1' dispatch={dispatch}/>
      <DigitButton digit='2' dispatch={dispatch}/>
      <DigitButton digit='3' dispatch={dispatch}/>
      <OperationButton operation='*' dispatch={dispatch}/>
      <DigitButton digit='4' dispatch={dispatch}/>
      <DigitButton digit='5' dispatch={dispatch}/>
      <DigitButton digit='6' dispatch={dispatch}/>
      <OperationButton operation='+' dispatch={dispatch}/>
      <DigitButton digit='7' dispatch={dispatch}/>
      <DigitButton digit='8' dispatch={dispatch}/>
      <DigitButton digit='9' dispatch={dispatch}/>
      <OperationButton operation='-' dispatch={dispatch}/>
      <DigitButton digit='.' dispatch={dispatch}/>
      <DigitButton digit='0' dispatch={dispatch}/>
      <button className='span-two' onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  )
}

export default App;
