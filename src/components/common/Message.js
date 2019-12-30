import styled, { css } from "styled-components";

export const Message = styled.span`
  display: block;
  margin-top: 16px;
  text-align: center;
  color: red;

  ${props =>
    props.success &&
    css`
      color: green;
    `}
`;
