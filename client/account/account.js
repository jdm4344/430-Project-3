const handleChange = (e) => {
    e.preventDefault();

    $("#messageBox").animate({width:"hide"},350);

    if($("#oldPass").val() == '' || $("#newPass").val == '' || $("#newPass2").val == '') {
        handleError("All fields are required");
        return false;
    }

    if($("#newPass").val() !== $("#newPass2").val()) {
        handleError("New passwords do not match");
        return false;
    }

    sendAjax("POST", $("#changeForm").attr("action"), $("#changeForm").serialize(), redirect);

    return false;
};

const AccountForm = (props) => {
    return(
        <form id="changeForm" 
            name="changeForm"
            onSubmit={handleChange} 
            action="/change"
            method="POST" 
            className="mainForm"
            >
        <label htmlFor="password">Current Password: </label>
        <input id="oldPass" type="password" name="password" placeholder="Current Password"/>
        <label htmlFor="newPass">New Password: </label>
        <input id="newPass" type="password" name="newPass" placeholder="New Password"/>
        <label htmlFor="newPass2">Confirm New Password: </label>
        <input id="newPass2" type="password" name="newPass2" placeholder="Retype New Password"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input id="changeSubmit" type="submit" value="Change Password" />
        </form>
    );
};

const setupAccount = (csrf) => {
    ReactDOM.render(
        <AccountForm csrf={csrf} />, document.querySelector("#content")
    );
};

const getToken = () => {
    sendAjax("GET", "/getToken", null, (result) => {
        setupAccount(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});