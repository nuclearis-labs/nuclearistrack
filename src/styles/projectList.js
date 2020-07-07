import styled, { keyframes } from 'styled-components';
import { Title, Scroll } from '../styles/components';
import { Row } from '../styles/tableComponents';

export const FlexWrap = styled.div`
  display: flex;
`;
export const FlexWrapRight = styled(FlexWrap)`
  padding-right: ${(props) =>
    props.details && props.details.id ? '20px' : '0px'};
  padding-left: ${(props) =>
    props.details && props.details.id ? '0px' : '37%'};
`;

export const Left = styled.div`
  padding: 0;
  width: ${(props) => (props.details && props.details.id ? '60%' : '100%')};
  background: #fff;
  min-width: 461px;
  ${Row} {
    padding: 4px 60px;
  }
`;
export const appear = keyframes`
from {
opacity:0;
}
to {
opacity: 1;
}`;

export const Right = styled.div`
  padding: 30px 40px;
  width: 40%;
  background: #ccc;
  min-width: 307px;
  text-align: left;
  box-sizing: border-box;
  animation: ${appear} 500ms;
  animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
`;

export const AddProyectBtn = styled.a`
  color: #8c6239;
  font-family: Montserrat, sans-serif;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 1px;
  padding: 40px 20px 0 20px;
  cursor: pointer;
  :hover {
    color: #000;
  }
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

export const ResumenName = styled.div`
  color: #333;
  font-weight: 700;
  font-size: 23px;
  letter-spacing: 1px;
  margin-bottom: 10px;
`;

export const ScrollBox400 = styled(Scroll)`
  height: 400px;
`;
