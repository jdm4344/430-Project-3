"use strict";

var handleChange = function handleChange(e) {
    e.preventDefault();

    $("#messageBox").animate({ width: "hide" }, 350);

    if ($("#oldPass").val() == '' || $("#newPass").val == '' || $("#newPass2").val == '') {
        handleError("All fields are required");
        return false;
    }

    if ($("#newPass").val() !== $("#newPass2").val()) {
        handleError("New passwords do not match");
        return false;
    }

    sendAjax("POST", $("#changeForm").attr("action"), $("#changeForm").serialize(), redirect);

    return false;
};

var AccountForm = function AccountForm(props) {
    return React.createElement(
        "form",
        { id: "changeForm",
            name: "changeForm",
            onSubmit: handleChange,
            action: "/change",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "label",
            { htmlFor: "password" },
            "Current Password: "
        ),
        React.createElement("input", { id: "oldPass", type: "password", name: "password", placeholder: "Current Password" }),
        React.createElement(
            "label",
            { htmlFor: "newPass" },
            "New Password: "
        ),
        React.createElement("input", { id: "newPass", type: "password", name: "newPass", placeholder: "New Password" }),
        React.createElement(
            "label",
            { htmlFor: "newPass2" },
            "Confirm New Password: "
        ),
        React.createElement("input", { id: "newPass2", type: "password", name: "newPass2", placeholder: "Retype New Password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { id: "changeSubmit", type: "submit", value: "Change Password" })
    );
};

var setupAccount = function setupAccount(csrf) {
    ReactDOM.render(React.createElement(AccountForm, { csrf: csrf }), document.querySelector("#content"));
};

var getToken = function getToken() {
    sendAjax("GET", "/getToken", null, function (result) {
        setupAccount(result.csrfToken);
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
