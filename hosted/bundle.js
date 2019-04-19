"use strict";

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

var handlePost = function handlePost(e, csrf) {
    e.preventDefault();

    $("#messageBox").animate({ width: "hide" }, 350);

    if ($("#postTitle").val() == '' || $("#postContent").val() == '') {
        handleError("All fields are required");
        return false;
    }

    sendAjax("POST", $("#postForm").attr("action"), $("#postForm").serialize(), function () {
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

var PostForm = function PostForm(props) {
    return React.createElement(
        "form",
        { id: "postForm",
            name: "postForm",
            onSubmit: function onSubmit(e) {
                return handleDomo(e, props.csrf);
            },
            action: "/maker",
            method: "POST",
            "class": "postForm"
        },
        React.createElement(
            "label",
            { "for": "name" },
            "Title: "
        ),
        React.createElement("input", { id: "postTitle", type: "text", name: "title", placeholder: "Post Title" }),
        React.createElement(
            "label",
            { "for": "content" },
            "Post Content: "
        ),
        React.createElement("textarea", { id: "postContent", type: "text", name: "content", placeholder: "", rows: "10", cols: "50" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { "class": "formSubmit", type: "submit", value: "Post Now" })
    );
};

// Sends a POST request to the server to delete a specific domo
var handleDelete = function handleDelete(e, csrf, domo) {
    e.preventDefault();

    // let parent = document.querySelector(`#${domo.name}DeleteForm`);
    // console.log(parent);
    // let key = parent.querySelector("input[name='_csrf']").value;
    // console.log(key);

    // console.log(`Deleted: ${domo.name} id: ${domo._id} csrf:${csrf}`);

    sendAjax("POST", $("#" + domo.name + "DeleteForm").attr("action"), $("#" + domo.name + "DeleteForm").serialize(), function () {
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

var PostsList = function PostsList(props) {
    if (props.posts.length === 0) {
        return React.createElement(
            "div",
            { className: "postList" },
            React.createElement(
                "h3",
                { className: "emptyPost" },
                "No Posts yet"
            )
        );
    }

    var postNodes = props.posts.map(function (post) {
        // console.log(`postList props: ${props.csrf}`);
        return React.createElement(
            "div",
            { key: post._id, className: "post" },
            React.createElement(
                "h3",
                { "class": "postTitle" },
                post.title
            ),
            React.createElement(
                "h3",
                { "class": "postOwner" },
                "By: ",
                post.ownerName
            ),
            React.createElement(
                "p",
                { "class": "postContent" },
                post.createdDate
            ),
            React.createElement(
                "h3",
                { "class": "postDate" },
                post.content
            ),
            React.createElement(
                "form",
                { id: post.title + "DeleteForm", onSubmit: function onSubmit(e) {
                        return handleDelete(e, props.csrf, post);
                    }, action: "/deletePost", method: "POST" },
                React.createElement("input", { type: "hidden", name: "postID", value: post._id }),
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                React.createElement("input", { type: "submit", value: "Delete Post" })
            )
        );
    });

    return React.createElement(
        "div",
        { className: "postList" },
        postNodes
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

var loadPostsFromServer = function loadPostsFromServer(csrf) {
    sendAjax("GET", "/getPosts", null, function (data) {
        ReactDOM.render(React.createElement(PostsList, { csrf: csrf, posts: data.posts }), document.querySelector("#posts"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(PostForm, { csrf: csrf }), document.querySelector("#makePost"));

    ReactDOM.render(React.createElement(PostsList, { csrf: csrf, posts: [] }), document.querySelector("#posts"));

    loadPostsFromServer(csrf);
};

var getToken = function getToken() {
    sendAjax("GET", "/getToken", null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(messate) {
    $("#errorMessage").text(messate);
    $("#messageBox").animate({ width: "toggle" }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: "hide" }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
