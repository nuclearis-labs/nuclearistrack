import styled from 'styled-components';

export const Table = styled.table`
  width: 50%;
  margin: auto;
`;

export const Row = styled.tr`
  padding: 1px 0;
  box-sizing: border-box;
  font-size: 13px;
  letter-spacing: 0.5px;
  color: #333;
  cursor: pointer;
  &.active {
    font-weight: 700;
  }
`;

export const HeadRow = styled(Row)`
  color: #8c6239;
  font-weight: 700;
  padding: 4px 0;
`;

export const Col = styled.td`
  font-weight: 700;
`;
