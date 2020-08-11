// tableComponents.js
import styled from 'styled-components';

export const Table = styled.table`
  margin: auto;
  padding: 20px 100px 20px 100px;
  text-align: left;
  width: 100%;
  box-sizing: border-box;
  max-width: 1300px;
`;

export const TableBody = styled.tbody``;

export const TableButton = styled.button`
  display: inline-block;
  font-size: '12px';
  font-family: 'Roboto condensed';
  margin: 0;
  background-color: #8c6239;
  color: #fff !important;
  font-family: 'Montserrat', sans-serif;
  border: none;
  height: 30px;
  padding: 5px 10px;
`;

export const TableWrap = styled.div`
  background-color: #e6e6e6;
`;

export const Row = styled.tr`
  vertical-align: baseline;
  text-align: left;
  font-size: 13px;
  letter-spacing: 0.5px;
  color: #333;
  &.active {
    font-weight: 700;
  }
`;

export const HeadRow = styled(Row)`
  color: #8c6239;
  font-weight: 700;
  padding: 4px 0;
`;

export const HeadRowMonsterrat = styled(HeadRow)`
  font-family: Montserrat, sans-serif;
`;

export const Col = styled.td`
  a {
    text-decoration: none;
    color: #333;
  }
  a:hover {
    color: #8c6239;
  }
  &.bold{
    font-weight:700;
  }
  &.color{
    color: #8c6239;
  }
`;

export const CenteredCol = styled(Col)`
  text-align: center;
`;

export const Col2 = styled.div`
  padding:3px 0;
  &.bold{font-weight:700; calc(100% - 120px);}
  &.color{color:#8c6239; width:130px;}
`;
export const Col3 = styled.div`
  width: 33%;
  font-weight: 700;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  a {
    text-decoration: none;
    color: #333;
  }
  a:hover {
    color: #8c6239;
  }
  svg {
    width: 20px;
    vertical-align: middle;
    margin-right: 5px;
  }
  svg .st0 {
    fill: #333;
  }
  a:hover svg .st0 {
    fill: #8c6239;
  }
`;

export const Col4 = styled(Col3)`
  width: 25%;
  &.bold{font-weight:700; calc(100% - 120px);}
  &.color{color:#8c6239; width:130px;}
`;
export const Col6 = styled(Col3)`
  width: 10%;
`;
