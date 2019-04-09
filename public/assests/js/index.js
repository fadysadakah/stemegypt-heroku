function del_cok (){
    document.cookie = 'email' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'key' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    // document.location.reload();
}
$('#sign_out').on('click',del_cok);
