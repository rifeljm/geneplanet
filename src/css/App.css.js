import styled, { createGlobalStyle } from 'styled-components';

const css = {};

css.Content = styled.div`
  padding: 20px;
`;

css.GlobalStyle = createGlobalStyle`
  body {
    font-family: helvetica;
  }
`;

export default css;
