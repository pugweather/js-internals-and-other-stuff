import { useState, useRref } from "react"
import data from "./data.js"

const INDENT_SPACING = 25

export function CommentsSection() {

    const [comments, setComments] = useState(data)

    return (
        <div>
            {comments.map(cmt => <CommentRow key={cmt.id} depth={0} comment={cmt}/>)}
        </div>
    )

}

function CommentRow({ depth, comment }) {
    return (
        <>
            <div style={{marginLeft: `${INDENT_SPACING * depth}px`}}>
                <div style={{fontWeight: "bold"}}>{comment.author}</div>
                <div>{comment.text}</div>
            </div>
            {comment.replies ? comment.replies.map(cmt => <CommentRow key={cmt.id} depth={depth + 1} comment={cmt}/>) : []}
        </>
    )
} 