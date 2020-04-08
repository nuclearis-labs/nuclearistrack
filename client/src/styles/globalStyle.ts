// globalStyle.js
import { createGlobalStyle } from 'styled-components';
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Montserrat:500,700|Roboto+Condensed&display=swap');
  html {
    background:#4d4d4d;
  }
  body {
    height: 100%;
    font-family: 'Roboto Condensed', sans-serif;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body * {box-sizing:border-box;}
  #root{min-height:100%;}
`;
export default GlobalStyle;
