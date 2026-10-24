import { useState, useRref } from "react"
import data from "./data.js"

const INDENT_SPACING = 25 

export function CommentsSection() {

    const [comments, setComments] = useState(data)

    function addReply(text, comment) {

        const newComment = {
            id: crypto.randomUUID(),
            author: "User",
            text: text,
            replies: []
        }  

        console.log(text, comment)

        // Ignore empty replies
        if (!text.trim()) return

        function insertNode(nodes, nodeId, text) {
            return nodes.map(currCmt => {
                currCmt.id === nodeId ?
                {...currCmt, replies: [...currCmt.replies, newComment]}
                : {...currCmt, replies: currCmt.replies.map(c => insertNode(nodes, c.id, text))}
            })
        }

        setComments(prev => {
            return prev.map(currCmt => 
                currCmt.id === comment.id ? 
                insertNode(comments, comment.id, text) : 
                currCmt.replies.map(c => insertNode(comments, comment.id, text)))
        })
    }

    return (
        <div>
            {comments.map(cmt => <CommentRow key={cmt.id} depth={0} comment={cmt} onReply={addReply}/>)}
        </div>
    )

}

function CommentRow({ depth, comment, onReply }) {

    const [hidden, setHidden] = useState(false)
    const [showReply, setShowReply] = useState(false)
    const [replyText, setReplyText] = useState('')

    return (
        <>
            <div 
                style={{margin: `25px 0 25px ${INDENT_SPACING * depth}px`}}
            >
                <div style={{cursor: "pointer"}} onClick={() => setHidden(prev => !prev)} >
                    <div style={{fontWeight: "bold"}}>{comment.author}</div>
                    <div>{comment.text}</div>
                </div>
                <div>
                    <button onClick={() => onReply(replyText, comment)}>reply</button>
                    <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)}/>
                </div>
            </div>
            {!hidden && comment.replies ? comment.replies.map(cmt => <CommentRow key={cmt.id} depth={depth + 1} comment={cmt}/>) : []}
        </>
    )
} 