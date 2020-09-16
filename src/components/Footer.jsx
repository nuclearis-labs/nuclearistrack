// footer.js
import React from 'react';
import { ReactComponent as Logo } from '../img/logo.svg';
import {
  FooterBg,
  FooterWrap,
  FooterLeft,
  FooterRight,
  FooterLink,
} from '../styles/footer';
import { useTranslation, Trans } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <FooterBg>
      <FooterWrap>
        <FooterLeft>
          <Logo style={{ position: 'relative', bottom: '5px' }} />
          <div style={{ marginTop: "-6px" }}>
            <Trans>footer:phrase</Trans>
          </div>
        </FooterLeft>
        <FooterRight>
          © {new Date().getFullYear()}. Nuclearis. NRS, S.A.{' '}
          {t('footer:license')}
          <FooterLink href="http://www.nuclearis.com">
            WWW.NUCLEARIS.COM
          </FooterLink>
          <a href="https://github.com/NRS-Soft/nuclearistrack">
            <svg
              style={{ marginTop: "3px" }}
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox="0 0 49.740822 48.514385"
              width="30"
              height="30"
              fill="#999"
            >
              <path
                d="M 24.870415,0 C 11.135825,0 0,11.13582 0,24.87041 c 0,10.9901 7.1253738,20.31044 17.008838,23.59833 1.243229,0.22772 1.697114,-0.54039 1.697114,-1.19616 0,-0.59203 -0.02278,-2.5532 -0.03493,-4.62978 -6.91587,1.50277 -8.377687,-2.93272 -8.377687,-2.93272 -1.132381,-2.87199 -2.7611989,-3.63705 -2.7611989,-3.63705 -2.2602446,-1.54226 0.1714699,-1.5119 0.1714699,-1.5119 2.497048,0.17303 3.811682,2.56233 3.811682,2.56233 2.219296,3.801 5.822932,2.70199 7.23768,2.06444 0.226068,-1.60297 0.869687,-2.70198 1.578688,-3.32131 C 14.810813,35.23817 9.0030851,33.10388 9.0030851,23.57404 c 0,-2.71719 0.9699948,-4.93337 2.5577669,-6.6745 -0.253513,-0.63147 -1.109648,-3.16194 0.245887,-6.58493 0,0 2.085714,-0.6679 6.839947,2.55019 1.982444,-0.55404 4.109156,-0.82728 6.223675,-0.83641 2.113014,0.009 4.241183,0.28538 6.226736,0.83942 4.745197,-3.2211 6.833924,-2.55018 6.833924,-2.55018 1.3601,3.42604 0.503966,5.95345 0.248947,6.58191 1.593843,1.74113 2.556261,3.95736 2.556261,6.6745 0,9.55413 -5.81686,11.65801 -11.357425,12.27433 0.895626,0.77113 1.687982,2.28303 1.687982,4.60248 0,3.32438 -0.03342,6.00509 -0.03342,6.82479 0,0.66184 0.45233,1.43598 1.712269,1.1931 C 42.62157,45.17477 49.740823,35.85444 49.740823,24.87041 49.740823,11.13582 38.604998,0 24.870409,0 Z"
              />
            </svg>
          </a>
        </FooterRight>
      </FooterWrap>
    </FooterBg>
  );
}
