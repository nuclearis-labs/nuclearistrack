import styled, { keyframes } from 'styled-components';
import { Title, Scroll } from '../styles/components';
import { Row } from '../styles/tableComponents';

export const fade = keyframes`
from {
  box-shadow: none;
}

to {
  box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 1);

}
`;

export const DropZone = styled.div`
height: 200px;
width: 500px;
padding: 0 22px;
background-color: ${(props) =>
    props.valid === true
      ? 'MEDIUMSPRINGGREEN'
      : props.valid === false
        ? 'lightcoral'
        : 'none'}
float: right;
margin: 13px 0;
text-align: center;
overflow: hidden;
cursor: pointer;
border: 2px solid grey;
&:hover {
  box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 1);
  animation: ${fade} 100ms linear;
}
`;
export const FlexWrap = styled.div`
  display: flex;
  height: 100%;
`;
export const FlexWrapRight = styled(FlexWrap)`
  float: right;
  padding-right: 40px;
  height: auto;
`;

export const Left = styled.div`
  padding: 0;
  width: 60%;
  background: #fff;
  min-width: 461px;
  ${Row} {
    padding: 4px 60px;
  }
`;

export const Right = styled(Scroll)`
  padding: 30px 40px;
  width: 40%;
  background: #ccc;
  min-width: 307px;
  text-align: left;
  box-sizing: border-box;
`;

export const ResumenTit = styled(Title)`
  color: #8c6239;
  font-size: 16px;
  line-height: 16px;
  margin: 10px 0;
`;

export const ProcesosTit = styled(ResumenTit)`
  color: #333;
  margin-top: 50px;
`;

export const Nota = styled.div`
  color: #333;
  font-size: 13px;
  line-height: 16px;
  margin: 10px 0;
`;
