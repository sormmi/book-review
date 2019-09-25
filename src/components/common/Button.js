import styled from "styled-components"

export const Button = styled.button`
  background: rebeccapurple;
  color: white;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  white-space: nowrap;
  
  ${props => props.block ? 'display: block; width: 100%;' : ''}
  
  &:hover {
    background: indigo;
  }
  
  &:focus {
    outline:0;
  }
`;
