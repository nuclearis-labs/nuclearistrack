import styled from 'styled-components';

export const FooterBg = styled.div`
  background-color: #4d4d4d;
`;
export const FooterWrap = styled.div`
  max-width: 768px;
  padding: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  margin: 0 auto;

  color: #999;
  font-size: 11px;
  line-height: 20px;
  letter-spacing: 1px;
`;
export const FooterLeft = styled.div`
  width: 33.333%;
  text-align: right;
  svg {
    filter: grayscale(1);
    width: 100px;
  }
`;
export const FooterRight = styled.div`
  width: 66.666%;
  text-align: left;
  color: #999;
  font-size: 11px;
  align-self: start;
  margin-left: 10px;
`;
export const FooterLink = styled.a`
  text-align: left;
  color: #999;
  text-decoration: none;
  display: block;
`;
