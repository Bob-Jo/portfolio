$(document).ready(function() {
    if ($('.wrapArea').hasClass('bg_mm')){
        $('body').addClass('gray_mm');
    };

    // 라디오버튼 on/off
    $('.form-radio').click(function() {
        $(this).parent().children().removeClass('is-checked');
        if(!$(this).hasClass('is-checked')) {
            $(this).addClass('is-checked');           
        }
    });

    // $('.add-bank').click(function(e) {
    //     e.preventDefault();
    //     var tmpl = '<div class="deposit-wrap  dotted"><div class="form-group_item clear"><span class="input"><input type="text" placeholder="예금주" /></span><span class="input"><input type="text" placeholder="은행명" /></span><span class="input"><input type="text" placeholder="계좌번호를 입력해주세요. (-제외)" /></span></div><div class="form-group_btn form-group_btn_cancel"><a href="#" class="remove-bank">취소</a></div></div>';

    //     $(tmpl).appendTo('.addbank-wrap');

    //     $('.remove-bank').click(function(e) {
    //         e.preventDefault();
    //         $(this).parents('.deposit-wrap').remove();
    //     });
    // });

})