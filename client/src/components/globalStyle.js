// globalStyle.js
import { createGlobalStyle } from 'styled-components';
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Montserrat:500,700|Roboto+Condensed&display=swap');
  body {
    font-family: 'Roboto Condensed', sans-serif;
    margin: 0;
    background-color: #fafafa;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;
export default GlobalStyle;
