// tableComponents.js
import styled from 'styled-components';

export const Table = styled.div`
  padding: 20px 0;
  margin: 75px auto 0 auto;
  width: 1000px;
  text-align: left;
  height: calc(100% - 75px);
  box-sizing: border-box;
`;

export const Row = styled.div`
  padding: 1px 0;
  box-sizing: border-box;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
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

export const Col = styled.div`
  width: 20%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
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
