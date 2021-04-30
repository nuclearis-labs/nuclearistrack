import styled, { keyframes } from 'styled-components';
const fade = keyframes`
from {
  box-shadow: none;
}

to {
  box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 1);

}
`;

export const DropZone = styled.div`
  width: 400px;
  padding: 0 22px;
  text-align: center;
  display: block;
  min-height: 140px;
  overflow: auto;
  cursor: pointer;
  border: 2px solid grey;
  width: fit-content;
  min-width: 400px;
  &:hover {
    box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 1);
    animation: ${fade} 100ms linear;
  }
`;
