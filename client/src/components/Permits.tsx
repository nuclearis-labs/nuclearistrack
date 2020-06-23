import React from 'react';
import { Checkbox } from '../styles/components';

interface IPermits {
  id: string;
  name: string;
  value: string;
  text: string;
  onChange: any;
}

export default function Permits(props: IPermits) {
  return (
    <div>
      <Checkbox
        type="checkbox"
        id={props.id}
        onChange={props.onChange}
        name={props.name}
        value={props.value}
      />
      <label style={{ paddingLeft: '20px' }} htmlFor={props.id}>
        {props.text}
      </label>
    </div>
  );
}
