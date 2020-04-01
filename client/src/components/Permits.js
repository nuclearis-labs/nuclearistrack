import React from 'react';
import { Checkbox } from './components';

export default function Permits(props) {
  return (
    <div>
      <Checkbox
        type="checkbox"
        id={props.id}
        name={props.name}
        value={props.value}
        ref={props.form}
        checked={props.checked}
      />
      <label style={{ paddingLeft: '20px' }} for={props.id}>
        {props.text}
      </label>
    </div>
  );
}
