function del_cok (){
    document.cookie = 'email' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'key' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    // document.location.reload();
}
$('#sign_out').on('click',del_cok);


    function form_valdiate() {
        // alert('1');
        if ($('#password1').val() != $('#password2').val()) {
            $('.alert').text('Passwords didn\'t match');
            $('.alert').css('visibility', 'visible ');
            $('#password2').addClass('inputerror ');
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
            $('.alert').css('visibility','visible');
            var elm = $('.alert')[0];
            var newone = elm.cloneNode(true);
            elm.parentNode.replaceChild(newone, elm);
            return false;
}
}
function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
}