import styled from "styled-components";
import { Link } from "gatsby";

export const LinkButton = styled(Link)`
  float: right;
  background: rebeccapurple;
  color: white;
  text-decoration: none;
  padding: 3px 14px;
  border-radius: 24px;

  &:hover {
    background: indigo;
  }
`;
