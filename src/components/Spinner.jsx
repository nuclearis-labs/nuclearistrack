import React from 'react';

export default function Spinner(props: { size: string; color: string }) {
  const className = `spinner-border text-${props.color} spinner-border-${props.size}`;
  return <div className={className} role="status" />;
}
