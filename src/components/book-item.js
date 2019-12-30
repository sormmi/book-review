import React from "react";
import styled from "styled-components";
import Img from "gatsby-image";

const BookItemStyled = styled.section`
  border: 1px solid #ddd;
  margin-bottom: 8px;
  padding: 8px;
  overflow: auto;
  display: flex;

  h2 {
    small {
      font-size: 0.6em;
      font-weight: normal;
      padding-left: 6px;
    }
  }
`;

const BookItemImageWrapper = styled.div`
  max-width: 200px;

  img {
    max-width: 200px;
  }
`;

const BookItemContentWrapper = styled.div`
  flex-grow: 1;
  padding-left: 16px;
`;

const BookItem = ({ authorName, title, summary, bookCover, children }) => {
  return (
    <BookItemStyled>
      <BookItemImageWrapper>
        <Img fixed={bookCover} />
      </BookItemImageWrapper>
      <BookItemContentWrapper>
        <h2>
          {title} <small>{authorName}</small>
        </h2>
        <div dangerouslySetInnerHTML={{ __html: summary }}></div>
        <div>{children}</div>
      </BookItemContentWrapper>
    </BookItemStyled>
  );
};

export default BookItem;
