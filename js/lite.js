function showRealtime() {
    var cr_namespace = $(this).data("namespace");
    realtime_state('RESET', '0');

    $.ajax({
        type: 'POST',
        url: '/system/realtime_modal_form',
        data: {cr_namespace : 'company', mode : 'lite'},
        dataType: 'html',
        async: true,
        cache: false,
        processData: true,
        beforeSend : function(jqXHR) {
            //if(typeof(submit_ladda) != 'undefined') submit_ladda.ladda( 'start' );
        },
        success: function(res) {
            $('#realtime_wrap').html(res);
        },
        error: function(res) {
            if (res.responseText) {
                swal(res.responseText, "", "error");
                //location.reload(true);
            }
        }
    });
}

$(document).ready(function(){
    /* bg gray */
    if ($('.container').hasClass('bg_bak')){
	  $('body').addClass('gray_bg');
	}

    /* header */
    $('header h1 .company_name').click(function(){
        $('header .over_box').slideToggle('fast');
    });

    /* nav menu */
    $('.menu_btn').click(function(){
        $('.nav_menu,.nav_cover,html').addClass('open');
    });

    $('.menu_close').click(function(){
        $('.main_head .over_box').hide();
        $('.nav_menu,.nav_cover,html').removeClass('open');
    });


    /* 판매보고서 */
    $('.report_result .drop_btn a').click(function(){
        $(this).toggleClass('drop');
        $(this).parent('.drop_btn').prev('ul').children('.inner').toggle();
    });

    /* 매출보고서 */
    $(function(){
        $('.sales_tit input').datepicker();
    });

    /* 예약관리 */
    $('.orders_list a.list_tit').click(function(){
        $(this).toggleClass('active');
        $(this).next('.list_box').toggle();
    });

    $(function(){
        $('.order_date input').datepicker();
    });

    /* 게시글관리 */
    $('.filter_count a.filter_btn').click(function(){
        $('html').toggleClass('html_popup');
        $('.filter_bg').toggle();
        $(this).toggleClass('active');
        $('.filter_inner, .filter_calendar').toggle();
    });
    $('.talk_list_box a.modify_btn').click(function(){
        $(this).next('.btn_box').toggle();
    });

    $('.view_wrap a.modify_btn').click(function(){
        //$('html').addClass('html_popup');
        $('.opacity_bg').show();
        $('.popup_view_modify').fadeIn();
    });

    $('.close_wrap').click(function(){
        $('html').removeClass('html_popup');
        $('.opacity_bg').hide();
        $(this).closest('div').hide();
    });

    $('.alarm_btn').click(function(e){
        e.preventDefault();
        showRealtime();
    });

    // 신규 알림이 있는 경우 알림 팝업 띄움
    if($('#cr_new_cnt').val() > 0){
        showRealtime();
    }

    $('.not_confirm').click(function(e){
        swal("일괄 확정 처리 가능한 예약건이 없습니다.", "", "warning");
        return false;
    });
});


$(document).bind( "mouseup", function(e){
	var popup = $(".filter_count, .datepicker");

	if (!popup.is(e.target) && popup.has(e.target).length === 0){
		$('.filter_bg, .opacity_bg, .popup_area').hide();
		$('html').removeClass('html_popup');
	}
});

$(document).scroll(function(){
	if($(window).scrollTop() > 5){
        $(".fix_calendar, .order_fix, .account_fix").fadeIn('fast');
    }
	else if($(window).scrollTop() < 5){
        $(".fix_calendar, .order_fix, .account_fix").fadeOut('fast');
    }
});

 $(".fix_calendar p").click(function(){
	$("html, body").animate({scrollTop: 0}, 500);
 });
