"use strict";

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
            className: "postForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Title: "
        ),
        React.createElement("input", { id: "postTitle", type: "text", name: "title", placeholder: "Post Title" }),
        React.createElement(
            "label",
            { htmlFor: "content" },
            "Post Content: "
        ),
        React.createElement("textarea", { id: "postContent", type: "text", name: "content", placeholder: "", rows: "10", cols: "50" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Post Now" })
    );
};

// Sends a POST request to the server to delete a specific domo
var handleDelete = function handleDelete(e, csrf, post) {
    e.preventDefault();

    console.log(post.title);

    var parent = document.querySelector("#" + post.title.replace(/ /g, '') + "DeleteForm");
    console.log(parent);
    var key = parent.querySelector("input[name='_csrf']").value;
    console.log(key);

    console.log("Deleted: " + post.title + " id: " + post._id + " csrf:" + csrf);

    sendAjax("POST", $("#" + post.title.replace(/ /g, '') + "DeleteForm").attr("action"), $("#" + post.title.replace(/ /g, '') + "DeleteForm").serialize(), function () {
        loadPostsFromServer(csrf);
    });

    return false;
};

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
                { className: "postTitle" },
                post.title
            ),
            React.createElement(
                "h3",
                { className: "postOwner" },
                "By: ",
                post.ownerName
            ),
            React.createElement(
                "p",
                { className: "postContent" },
                post.createdDate
            ),
            React.createElement(
                "h3",
                { className: "postDate" },
                post.content
            ),
            React.createElement(
                "form",
                { id: post.title.replace(/ /g, '') + "DeleteForm", onSubmit: function onSubmit(e) {
                        return handleDelete(e, props.csrf, post);
                    }, action: "/deletePost", method: "POST" },
                React.createElement("input", { type: "hidden", name: "postID", value: post._id }),
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                React.createElement("input", { className: "formSubmit", type: "submit", value: "Delete Post" })
            )
        );
    });

    return React.createElement(
        "div",
        { className: "postList" },
        postNodes
    );
};

var AccountInfo = function AccountInfo(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "h3",
            { className: "postOwner" },
            props.username
        )
    );
};

var loadPostsFromServer = function loadPostsFromServer(csrf) {
    sendAjax("GET", "/getPosts", null, function (data) {
        ReactDOM.render(React.createElement(PostsList, { csrf: csrf, posts: data.posts }), document.querySelector("#posts"));
    });
};

var loadUserData = function loadUserData(csrf) {
    sendAjax("GET", '/info', null, function (data) {
        ReactDOM.render(React.createElement(AccountInfo, { username: data.username }), document.querySelector("#info"));
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

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
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
