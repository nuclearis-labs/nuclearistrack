import React from 'react';
import { Button } from '../styles/components';

export default function SubmitButton(props: {
  submitting: boolean;
  text: string;
  error: string | null;
  loadingText: string;
}) {
  return (
    <Button className="submit" disabled={props.submitting} type="submit">
      {props.submitting === false
        ? props.text
        : props.error
        ? props.error
        : props.loadingText}
    </Button>
  );
}
