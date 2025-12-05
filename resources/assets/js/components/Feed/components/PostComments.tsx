import React, { useState, useEffect } from "react";
import txtImg from "../../../../images/txt_img.png";
import commentImg from "../../../../images/comment_img.png";
import { addComment } from "../../../services/api";

const PostComments = ({ post, openMainCommentBox, handleLikeToggle }) => {
  const [comments, setComments] = useState([]);
  const [showCommentBox, setShowCommentBox] = useState(false); // toggle main comment box
  const [newComment, setNewComment] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setComments(buildTree(post.comments));
  }, [post]);

  const handleCommentSubmit = async (postId, parentId, body, file = null) => {
    if (!body.trim() && !file) return;

    const res = await addComment(postId, body, parentId, file);
    const newComment = res.data;

    if (!parentId) {
      setComments((prev) => [...prev, { ...newComment, children: [] }]);
    } else {
      setComments((prev) =>
        addChildComment(prev, parentId, { ...newComment, children: [] })
      );
    }
  };

  const buildTree = (comments) => {
    const map = {};
    comments.forEach((c) => (map[c.id] = { ...c, children: [] }));
    const tree = [];
    comments.forEach((c) => {
      if (c.parent_id) {
        if (map[c.parent_id]) map[c.parent_id].children.push(map[c.id]);
      } else {
        tree.push(map[c.id]);
      }
    });
    return tree;
  };

  const addChildComment = (list, parentId, newComment) => {
    return list.map((comment) => {
      if (comment.id === parentId) {
        return { ...comment, children: [...(comment.children || []), newComment] };
      } else if (comment.children) {
        return { ...comment, children: addChildComment(comment.children, parentId, newComment) };
      }
      return comment;
    });
  };

  const handleMainSubmit = async (e) => {
    e.preventDefault();
    await handleCommentSubmit(post.id, null, newComment, file);
    setNewComment("");
    setFile(null);
    setShowCommentBox(false); // close after submitting
  };

  return (
    <div className="_timline_comment_main">
      {/* Button to open comment box */}

      {/* MAIN COMMENT BOX */}
      {openMainCommentBox && (
        <div className="_feed_inner_timeline_cooment_area">
          <div className="_feed_inner_comment_box">
            <form className="_feed_inner_comment_box_form" onSubmit={handleMainSubmit}>
              <div className="_feed_inner_comment_box_content">
                <div className="_feed_inner_comment_box_content_image">
                  <img src={commentImg} alt="" className="_comment_img" />
                </div>
                <div className="_feed_inner_comment_box_content_txt">
                  <textarea
                    className="form-control _comment_textarea"
                    placeholder="Write a comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </div>
              </div>
              <div className="_feed_inner_comment_box_icon">
                <label className="_feed_inner_comment_box_icon_btn" style={{ cursor: "pointer" }}>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                    <path fill="#00000075" d="M3 4L5 2h6l2 2h2v10H1V4z" />
                    <circle cx="8" cy="9" r="3" fill="#00000075" />
                  </svg>
                </label>
                <button type="submit" className="_feed_inner_comment_box_icon_btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                    <path fill="#1580b2ff" d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMMENTS LIST */}
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          postId={post.id}
          handleCommentSubmit={handleCommentSubmit}
          handleLikeToggle={handleLikeToggle}
        />
      ))}
    </div>
  );
};

// Single Comment Component (reply logic stays the same)
const Comment = ({ comment, postId, handleCommentSubmit, handleLikeToggle }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = (e) => {
    e.preventDefault();
    handleCommentSubmit(postId, comment.id, replyText);
    setReplyText("");
    setShowReply(false);
  };

  return (
    <div className="_comment_main">
      <div className="_comment_image">
        <img src={txtImg} alt="" className="_comment_img1" />
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
          <div className="_comment_details_top">
            <h4 className="_comment_name_title">{comment?.author?.name}</h4>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text">{comment?.body}</p>
          </div>
          <div className="_comment_reply">
            <ul className="_comment_reply_list">
              <li>
                {comment.likes_count &&
                  <span>{comment.likes_count || 0}{" "}</span>
                }
                <span
                  onClick={() => handleLikeToggle(comment?.id, 'comment')}
                  style={{ color: comment?.liked ? "blue" : "black", cursor: "pointer" }}
                >
                  Like.
                </span>
              </li>
              <li>
                <span onClick={() => setShowReply(!showReply)}>Reply.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Reply Box */}
        {showReply && (
          <div className="_feed_inner_comment_box" style={{ marginTop: "10px" }}>
            <form className="_feed_inner_comment_box_form" onSubmit={handleReplySubmit}>
              <div className="_feed_inner_comment_box_content">
                <div className="_feed_inner_comment_box_content_image">
                  <img src={commentImg} alt="" className="_comment_img" />
                </div>
                <div className="_feed_inner_comment_box_content_txt">
                  <textarea
                    className="form-control _comment_textarea"
                    placeholder="Write a reply"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </div>
              </div>
              <div className="_feed_inner_comment_box_icon">
                <button className="_feed_inner_comment_box_icon_btn" type="submit">
                  Post
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Nested Replies */}
        {comment.children && comment.children.length > 0 && (
          <div style={{ marginLeft: "20px" }}>
            {comment.children.map((child) => (
              <Comment
                key={child.id}
                comment={child}
                postId={postId}
                handleCommentSubmit={handleCommentSubmit}
                handleLikeToggle={handleLikeToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostComments;
