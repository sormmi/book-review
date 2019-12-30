import React, { useContext } from "react";
import { graphql } from "gatsby";
import BookItem from "../components/book-item";
import BookComments from "../components/book/BookComments";
import { FirebaseContext } from "../firebase";

const BookTemplate = ({ data }) => {
  const { firebase } = useContext(FirebaseContext);

  return (
    <section>
      <BookItem
        authorName={data.book.author.name}
        title={data.book.title}
        summary={data.book.summary}
        bookCover={data.book.localImage.childImageSharp.fixed}
      />
      {firebase && <BookComments firebase={firebase} bookId={data.book.id} />}
    </section>
  );
};

export const query = graphql`
  query BookQuery($bookId: String!) {
    book(id: { eq: $bookId }) {
      title
      summary
      id
      author {
        name
      }
      localImage {
        childImageSharp {
          fixed(width: 200) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  }
`;

export default BookTemplate;
