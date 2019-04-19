// const handleDomo = (e, csrf) => {
//     e.preventDefault();

//     $("#messageBox").animate({width:"hide"},350);

//     if($("#domoName").val() == '' || $("#domoAge").val() == '') {
//         handleError("RAWR! All fields are required");
//         return false;
//     }

//     sendAjax("POST", $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
//         loadDomosFromServer(csrf);
//     });

//     return false;
// };

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

// const DomoForm = (props) => {
//     // console.log(`domoForm props: ${props.csrf}`);

//     return (
//         <form id="domoForm" 
//             name="domoForm"
//             onSubmit={(e) => handleDomo(e, props.csrf)}
//             action="/maker"
//             method="POST"
//             className="domoForm"
//           >
//           <label htmlFor="name">Name: </label>
//           <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
//           <label htmlFor="age">Age: </label>
//           <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
//           <label htmlFor="food">Favorite food: </label>
//           <input id="domoFood" type="text" name="food" placeholder="Domo's favorite food"/>
//           <input type="hidden" name="_csrf" value={props.csrf}/>
//           <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
//         </form>
//     );
// };

const PostForm = (props) => {
    return (
        <form id="postForm"
                name="postForm" 
                onSubmit={(e) => handleDomo(e, props.csrf)}
                action="/maker" 
                method="POST" 
                class="postForm"
            >
            <label for="name">Title: </label>
            <input id="postTitle" type="text" name="title" placeholder="Post Title"/>
            <label for="content">Post Content: </label>
            <textarea id="postContent" type="text" name="content" placeholder="" rows="10" cols="50"></textarea>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input class="formSubmit" type="submit" value="Post Now" />
        </form>
    );
};

// Sends a POST request to the server to delete a specific domo
const handleDelete = (e, csrf, domo) => {
    e.preventDefault();

    // let parent = document.querySelector(`#${domo.name}DeleteForm`);
    // console.log(parent);
    // let key = parent.querySelector("input[name='_csrf']").value;
    // console.log(key);

    // console.log(`Deleted: ${domo.name} id: ${domo._id} csrf:${csrf}`);

    sendAjax("POST", $(`#${domo.name}DeleteForm`).attr("action"), $(`#${domo.name}DeleteForm`).serialize(), function() {
        loadDomosFromServer(csrf);
    });

    return false;
};

// const DomoList = (props) => {
//     if(props.domos.length === 0) {
//         return (
//             <div className="domoList">
//                 <h3 className="emptyDomo">No Domos yet</h3>
//             </div>
//         );
//     }


//     const domoNodes = props.domos.map(function(domo) {
//         // console.log(`domoList props: ${props.csrf}`);
//         return(
//             <div key={domo._id} className="domo">
//                 <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
//                 <h3 className="domoName"> Name: {domo.name} </h3>
//                 <h3 className="domoAge"> Age: {domo.age} </h3>
//                 <h3 className="domoFood"> Favorite Food: {domo.favoriteFood} </h3>
//                 <form id={`${domo.name}DeleteForm`} onSubmit={(e) => handleDelete(e, props.csrf, domo)} action="/deleteDomo" method="POST">
//                     <input type="hidden" name="domoID" value={domo._id}/>
//                     <input type="hidden" name="_csrf" value={props.csrf}/>
//                     <input type="submit" value="Delete Domo"/>
//                 </form>
//             </div>
//         );
//     });

//     return (
//         <div className="domoList">
//             {domoNodes}
//         </div>
//     );
// };

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
                <h3 class="postTitle">{post.title}</h3>
                <h3 class="postOwner">By: {post.ownerName}</h3>
                <p class="postContent">{post.createdDate}</p>
                <h3 class="postDate">{post.content}</h3>
                <form id={`${post.title}DeleteForm`} onSubmit={(e) => handleDelete(e, props.csrf, post)} action="/deletePost" method="POST">
                    <input type="hidden" name="postID" value={post._id}/>
                    <input type="hidden" name="_csrf" value={props.csrf}/>
                    <input type="submit" value="Delete Post"/>
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

// const loadDomosFromServer = (csrf) => {
//     // console.log(`Loading domos froms server. token=${csrf} caller=${caller}`);
//     sendAjax("GET", "/getDomos", null, (data) => {
//         ReactDOM.render(
//             <DomoList csrf={csrf} domos={data.domos} />, document.querySelector("#domos")
//         );
//     });
// };

const loadPostsFromServer = (csrf) => {
    sendAjax("GET", "/getPosts", null, (data) => {
        ReactDOM.render(
            <PostsList csrf={csrf} posts={data.posts} />, document.querySelector("#posts")
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