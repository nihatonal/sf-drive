import React, { useReducer, useEffect } from 'react';

import { validate } from '../../util/validators';
import './Input.css';



const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators)
      };
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true
      }
    }
    default:
      return state;
  }
};

const Input = props => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid)
  }, [id, value, isValid, onInput]);

  const changeHandler = event => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH'
    });
  };

  const element =
    props.element === 'input' ? (
      <input
        id={props.id}
        className={props.className}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
        ref={props.ref}
        list={props.list}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  return (
      <div
      className={`form__container_wrapper-form-item ${!inputState.isValid && inputState.isTouched &&
        'form-control--invalid'}`}
      >
      <label className={props.labelclassName} htmlFor={props.id}>{props.label}
        {element} {props.datalist}
        <p className={!inputState.isValid && inputState.value !== "" ? "place-holder" : `${props.placeholderclassName}`}
        >{props.labelplaceholder}</p>
      </label>
      
      {!inputState.isValid && inputState.isTouched && <p className={`error_text ${props.errorTextclassName}`}>{props.errorText}</p>}
    </div>
  );
};

export default Input;