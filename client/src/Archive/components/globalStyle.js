// globalStyle.js
import { createGlobalStyle } from 'styled-components';
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Montserrat:500,700|Roboto+Condensed&display=swap');
  html {
    min-height:100%;
    display:flex;
    background:#4d4d4d;
  }
  body {
    flex:1;
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