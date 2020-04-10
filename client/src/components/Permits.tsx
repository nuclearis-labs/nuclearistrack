import React from 'react';
import { Checkbox } from '../styles/components';

interface IPermits {
  id: string;
  name: string;
  value: string;
  form: any;
  text: string;
}

export default function Permits(props: IPermits) {
  return (
    <div>
      <Checkbox
        type="checkbox"
        id={props.id}
        name={props.name}
        value={props.value}
      />
      <label style={{ paddingLeft: '20px' }} htmlFor={props.id}>
        {props.text}
      </label>
    </div>
  );
}
