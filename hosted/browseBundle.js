"use strict";

var AllPostsList = function AllPostsList(props) {
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
        // console.log(`postList props: ${props}`);
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
                { id: post.title + "DeleteForm", onSubmit: function onSubmit(e) {
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

var loadAllPostsFromServer = function loadAllPostsFromServer(csrf) {
    sendAjax("GET", "/getAllPosts", null, function (data) {
        // console.log(data);
        ReactDOM.render(React.createElement(AllPostsList, { csrf: csrf, posts: data.posts }), document.querySelector("#posts"));
    });
};

var setupBrowse = function setupBrowse(csrf) {
    ReactDOM.render(React.createElement(AllPostsList, { csrf: csrf, posts: [] }), document.querySelector("#posts"));

    loadAllPostsFromServer(csrf);
};

var getToken = function getToken() {
    sendAjax("GET", "/getToken", null, function (result) {
        setupBrowse(result.csrfToken);
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
