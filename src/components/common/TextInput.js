import styled from "styled-components";

export const Input = styled.textarea`
  display: block;
  width: 100%;
  padding: 8px;
  font-size: 16px;
  margin-bottom: 6px;
  border-radius: 4px;
  border: 1px solid #ddd;
  box-shadow: none;
  rows: 5;

  &:focus,
  &:active {
    border: 1px solid rebeccapurple;
    outline: none;
  }
`;
