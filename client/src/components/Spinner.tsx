import React from 'react';

export default function Spinner(props: any) {
  const className = `spinner-border text-primary spinner-border-${props.size}`;
  return <div className={className} role="status" />;
}
