import React from 'react';
import { Link } from 'react-router-dom';

import './Button.css';

const Button = props => {
  if (props.href) {
    return (
      <a
        className={`button button--${props.size || 'default'} ${props.inverse &&
          'button--inverse'} ${props.danger && 'button--danger'}`}
        href={props.href}
      >
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      <Link
        to={props.to}
        exact={props.exact}
        className={`button ${props.btnclass} button--${props.size || 'default'} ${props.inverse &&
          'button--inverse'} ${props.danger && 'button--danger'} ${props.className}`}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button
      className={`button ${props.className} ${props.inverse &&
        `button--inverse ${props.inverseClass}`} ${props.danger && 'button--danger'}`}
      type={props.type}
      style={props.style}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
