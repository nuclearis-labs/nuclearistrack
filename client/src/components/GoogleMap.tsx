import React from 'react';

export function GoogleMap(props: { coords: Coordinates }): JSX.Element | null {
  if (props.coords) {
    return (
      <iframe
        frameBorder="0"
        title="DocumentLocation"
        style={{ border: '0', width: '370px', height: '250px' }}
        src={`https://www.google.com/maps/embed/v1/view?zoom=13&center=${props.coords.latitude},${props.coords.longitude}&key=AIzaSyCHpdtM1Pvk-nSgdFB02zUeq7TnTy_eGPs`}
        allowFullScreen
      ></iframe>
    );
  }
  return null;
}
