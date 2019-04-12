function del_cok() {
    document.cookie = 'session_id' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    // document.cookie = 'key' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    // document.location.reload();
}
$('#sign_out').on('click', del_cok);


function form_valdiate() {
    // alert('1');
    if ($('#password1').val() != $('#password2').val()) {
        $('.alert').text('Passwords didn\'t match');
        $('.alert').css('visibility', 'visible ');
        $('.alert').removeClass('alert-success');
        $('.alert').addClass('alert-danger');
        $('#password2').addClass('inputerror');
        var elm = $('.alert')[0];
        var newone = elm.cloneNode(true);
        elm.parentNode.replaceChild(newone, elm);
        
        $('#password2').focus(function () {
            $(this).removeClass('inputerror');

        });

        return false;
    }
    if (!$('#agree_box').is(":checked")) {
        $('.alert').text('please agree to our terms and conditions');
        $('.alert').css('visibility', 'visible');
        var elm = $('.alert')[0];
        var newone = elm.cloneNode(true);
        elm.parentNode.replaceChild(newone, elm);
        $('.alert').removeClass('alert-success');
        $('.alert').addClass('alert-danger');
        return false;
    }
}
function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();

    $.post("/g-signin",
        {
            ID: profile.getId(),
            Full_Name: profile.getName(),
            Given_Name: profile.getGivenName(),
            Family_Name: profile.getFamilyName(),
            Image_URL: profile.getImageUrl(),
            Email: profile.getEmail(),
            id_token: googleUser.getAuthResponse().id_token
        },
        function (data, status) {
            alert("Data: " + data + "\nStatus: " + status);
        });
    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
}