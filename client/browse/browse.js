const AllPostsList = (props) => {
    if(props.posts.length === 0) {
        return (
            <div className="postList">
                <h3 className="emptyPost">No Posts yet</h3>
            </div>
        );
    }


    const postNodes = props.posts.map(function(post) {
        // console.log(`postList props: ${props}`);
        return(
            <div key={post._id} className="post">
                <h3 className="postTitle">{post.title}</h3>
                <h3 className="postOwner">By: {post.ownerName}</h3>
                <p className="postContent">{post.createdDate}</p>
                <h3 className="postDate">{post.content}</h3>
                <form id={`${post.title}DeleteForm`} onSubmit={(e) => handleDelete(e, props.csrf, post)} action="/deletePost" method="POST">
                    <input type="hidden" name="postID" value={post._id}/>
                    <input type="hidden" name="_csrf" value={props.csrf}/>
                    <input className="formSubmit" type="submit" value="Delete Post"/>
                </form>
            </div>
        );
    });

    return (
        <div className="postList">
            {postNodes}
        </div>
    );
};

const loadAllPostsFromServer = (csrf) => {
    sendAjax("GET", "/getAllPosts", null, (data) => {
        // console.log(data);
        ReactDOM.render(
            <AllPostsList csrf={csrf} posts={data.posts} />, document.querySelector("#posts")
        );
    });
};

const setupBrowse = (csrf) => {
    ReactDOM.render(
        <AllPostsList csrf={csrf} posts={[]} />, document.querySelector("#posts")
    );

    loadAllPostsFromServer(csrf);
};

const getToken = () => {
    sendAjax("GET", "/getToken", null, (result) => {
        setupBrowse(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});