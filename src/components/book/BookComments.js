import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Button, Input } from "../common"
import moment from 'moment'
import StarRatingComponent from 'react-star-rating-component';

const CommentForm = styled.form`
  display: flex;
  margin-top: 30px;
  
  ${Input} {
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 6px;
  }
  
  div.dv-star-rating {
    min-width: 100px;
    margin: auto 10px;
    margin-left: 0;
  }
  
  ${Button} {
    margin: auto 0;
  }
`;

const CommentListItem = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 3px 0;
  font-size: 0.85em;
  margin-bottom: 3px;
`;

const CommentListHeader = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 0 20px;
  
  >strong {
    font-size: 0.85em;
    color: #999;
  }
`;

const BookComments = ({firebase, bookId}) => {

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const unsubscribe = firebase.subscribeBookComments({
      bookId,
      onSnapshot: (snapshot) => {
        const snapshotComments = [];
        snapshot.forEach(doc => {
          snapshotComments.push({
            id: doc.id,
            ...doc.data()
          })
        })
        setComments(snapshotComments);
      }
    })

    return () => {
      if(unsubscribe){
        unsubscribe();
      }
    }
  }, [])

  const handlePostCommentSubmit = async (e) => {
    e.preventDefault();

    await firebase.postComment({
      text: commentText,
      rating: rating,
      bookId
    });

    setRating(0);
    setCommentText('');
  };

  const onStarClick = (nextVal, prevVal) => {
    let rating = (nextVal === 1 && prevVal === 1) ? 0 : nextVal;
    setRating(rating);
  }

  return (
    <div>
      <CommentForm onSubmit={handlePostCommentSubmit}>
        <Input value={commentText} onChange={e => {
          e.persist();
          setCommentText(e.target.value);
        }}/>
        <StarRatingComponent value={rating} name="rating" onStarClick={onStarClick}/>
        <Button type="submit">Arvostele</Button>
      </CommentForm>

      {comments.map(c => (
        <CommentListItem key={c.id}>
          <CommentListHeader>
            <StarRatingComponent value={c.rating} name="rating2" editing={false}/>
            <strong>
              {c.username} - {moment(c.dateCreated.toDate()).format('HH:mm Do MMM YYYY')}
            </strong>
          </CommentListHeader>
          <div>
            {c.text}
          </div>
        </CommentListItem>
      ))}
    </div>
  )
}

export default BookComments;
