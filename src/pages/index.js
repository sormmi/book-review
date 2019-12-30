import React from "react";
import { graphql } from "gatsby";

import BookItem from "../components/book-item";
import { LinkButton } from "../components/common";

const IndexPage = props => {
  return (
    <section>
      {props.data.allBook.edges.map(({ node }) => (
        <BookItem
          key={node.id}
          authorName={node.author.name}
          title={node.title}
          summary={
            node.summary.length < 300
              ? node.summary
              : node.summary.substr(0, node.summary.indexOf(" ", 300)) + "..."
          }
          bookCover={node.localImage.childImageSharp.fixed}
        >
          <LinkButton to={`/book/${node.id}`}> Arvostelut </LinkButton>
        </BookItem>
      ))}
    </section>
  );
};

export const query = graphql`
  {
    allBook {
      edges {
        node {
          title
          summary
          id
          localImage {
            childImageSharp {
              fixed(width: 200) {
                ...GatsbyImageSharpFixed
              }
            }
          }
          author {
            name
          }
        }
      }
    }
  }
`;

export default IndexPage;
