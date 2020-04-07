
$(document).ready(function(){
    if ($('.wrapArea').hasClass('bg_bak')){
      $('body').addClass('gray_bg');
    }
    /* 예약관리 */
    $('.orders_list a.list_tit').click(function(){
        $(this).toggleClass('active');
        $(this).next('.list_box').toggle();
    });
});
