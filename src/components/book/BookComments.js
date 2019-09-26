import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Button, Input } from "../common"
import moment from "moment"
import StarRatingComponent from "react-star-rating-component"

const CommentForm = styled.form`
  display: flex;
  margin: 35px 0;

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
`

const CommentListItem = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 3px 0;
  font-size: 0.85em;
  margin-bottom: 3px;
`

const CommentListHeader = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 0 20px;

  > strong {
    font-size: 0.9em;
    color: #999;
  }
`

const BookComments = ({ firebase, bookId }) => {
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState("")
  const [rating, setRating] = useState(0)

  useEffect(() => {
    const unsubscribe = firebase.subscribeBookComments({
      bookId,
      onSnapshot: comments => {
        const snapshotComments = []
        comments.forEach(doc => {
          snapshotComments.push({
            id: doc.id,
            ...doc.data(),
          })
        })
        setComments(snapshotComments)
      },
    }, [firebase, bookId])

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  /**
   * Post comment handler
   * @param e
   * @returns {Promise<void>}
   */
  const handlePostCommentSubmit = async e => {
    e.preventDefault()

    await firebase.postComment({
      text: commentText,
      rating: rating,
      bookId,
    })

    setRating(0)
    setCommentText("")
  }

  /**
   * Star click handler
   * @param nextVal
   * @param prevVal
   */
  const onStarClick = (nextVal, prevVal) => {
    let rating = nextVal === 1 && prevVal === 1 ? 0 : nextVal
    setRating(rating)
  }

  /**
   * Handle comment input field changes
   * @param e
   */
  const onCommentChange = e => {
    e.persist()
    setCommentText(e.target.value)
  }

  return (
    <>
      <CommentForm onSubmit={handlePostCommentSubmit}>
        <Input value={commentText} onChange={onCommentChange} />
        <StarRatingComponent
          value={rating}
          name="rating"
          onStarClick={onStarClick}
        />
        <Button type="submit">Arvostele</Button>
      </CommentForm>

      {comments.map(c => (
        <CommentListItem key={c.id}>
          <CommentListHeader>
            <StarRatingComponent
              value={c.rating}
              name="rating2"
              editing={false}
            />
            <strong>
              {c.username} {" | "}
              {moment(c.dateCreated.toDate()).format("HH:mm Do MMM YYYY")}
            </strong>
          </CommentListHeader>
          <div>{c.text}</div>
        </CommentListItem>
      ))}
    </>
  )
}

export default BookComments
