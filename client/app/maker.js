const handlePost = (e, csrf) => {
    e.preventDefault();

    $("#messageBox").animate({width:"hide"},350);

    if($("#postTitle").val() == '' || $("#postContent").val() == '') {
        handleError("All fields are required");
        return false;
    }

    sendAjax("POST", $("#postForm").attr("action"), $("#postForm").serialize(), function() {
        loadPostsFromServer(csrf);
    });

    return false;
};

const PostForm = (props) => {
    return (
        <form id="postForm"
                name="postForm" 
                onSubmit={(e) => handleDomo(e, props.csrf)}
                action="/maker" 
                method="POST" 
                className="postForm"
            >
            <label htmlFor="name">Title: </label>
            <input id="postTitle" type="text" name="title" placeholder="Post Title"/>
            <label htmlFor="content">Post Content: </label>
            <textarea id="postContent" type="text" name="content" placeholder="" rows="10" cols="50"></textarea>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Post Now" />
        </form>
    );
};

// Sends a POST request to the server to delete a specific domo
const handleDelete = (e, csrf, post) => {
    e.preventDefault();

    console.log(post.title);

    let parent = document.querySelector(`#${post.title.replace(/ /g, '')}DeleteForm`);
    console.log(parent);
    let key = parent.querySelector("input[name='_csrf']").value;
    console.log(key);

    console.log(`Deleted: ${post.title} id: ${post._id} csrf:${csrf}`);

    sendAjax("POST", $(`#${post.title.replace(/ /g, '')}DeleteForm`).attr("action"), $(`#${post.title.replace(/ /g, '')}DeleteForm`).serialize(), function() {
        loadPostsFromServer(csrf);
    });

    return false;
};

const PostsList = (props) => {
    if(props.posts.length === 0) {
        return (
            <div className="postList">
                <h3 className="emptyPost">No Posts yet</h3>
            </div>
        );
    }


    const postNodes = props.posts.map(function(post) {
        // console.log(`postList props: ${props.csrf}`);
        return(
            <div key={post._id} className="post">
                <h3 className="postTitle">{post.title}</h3>
                <h3 className="postOwner">By: {post.ownerName}</h3>
                <p className="postContent">{post.createdDate}</p>
                <h3 className="postDate">{post.content}</h3>
                <form id={`${post.title.replace(/ /g, '')}DeleteForm`} onSubmit={(e) => handleDelete(e, props.csrf, post)} action="/deletePost" method="POST">
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

const AccountInfo = (props) => {
    return(
        <div>
            <h3 className="postOwner">{props.username}</h3>
        </div>
    );
};

const loadPostsFromServer = (csrf) => {
    sendAjax("GET", "/getPosts", null, (data) => {
        ReactDOM.render(
            <PostsList csrf={csrf} posts={data.posts} />, document.querySelector("#posts")
        );
    });
};

const loadUserData = (csrf) => {
    sendAjax("GET", '/info', null, (data) => {
        ReactDOM.render(
            <AccountInfo username={data.username}/>, document.querySelector("#info")
        );
    });
};

const setup = (csrf) => {
    ReactDOM.render(
        <PostForm csrf={csrf}/>, document.querySelector("#makePost")
    );

    ReactDOM.render(
        <PostsList csrf={csrf} posts={[]} />, document.querySelector("#posts")
    );

    loadPostsFromServer(csrf);
};

const getToken = () => {
    sendAjax("GET", "/getToken", null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});