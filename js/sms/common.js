// 바이트만큼 자르기
var cutByLen = function(str, maxByte) {
    for(b=i=0;c=str.charCodeAt(i);)
    {
        b+=c>>7?2:1;
        if(b > maxByte) break;
        i++;
    }

    return str.substring(0,i);
}

//제목/내용 길이 세팅
var len_set = function(mode, length) {
    if(mode == 'msg') {
        if(length > 90) {
            $('.sms-input .byte').addClass('text-red').find('.text_byte_check_len').css('color', '#dd4b39');
            $('.sms-input .byte').find('.type').text('LMS : 건당 '+sms_obj.lms+'포인트 차감');
        } else {
            $('.sms-input .byte').removeClass('text-red').find('.text_byte_check_len').css('color', '#333');
            $('.sms-input .byte').find('.type').text('SMS : 건당 '+sms_obj.sms+'포인트 차감');
        }

        $('.sms-input .byte').find('.text_byte_check_len').text(length);
    } else if(mode == 'title') {
        if(length > 20) {
            var subs = $('#sst_title').val().substring(0,20);
            $('#sst_title').val(subs);
            length = subs.length;
        }
        $('.sms_title').find('.text_check_len').text(length);
    }
};

$(function() {
    // 일자 선택
    $('.input-daterange').datepicker({
        language: "kr"
        , format: 'yyyy.mm.dd'
        , toggleActive: true
        , keyboardNavigation: false
        , forceParse: false
        , autoclose: true
    })

    // 검색 버튼
    $.fn.listSearchBtn = function(selector, hiddens) {
        $(document).on('click', selector, function(e) {
            e.preventDefault();
            if(hiddens) {
                $.each($(this).data(), function(idx, val) {
                    $('input[type=hidden][name='+idx+']').val(val);
                });
            }

            var form = $(this).parents("form");
            $(form).submit();
        });
    };

    // 필터 선택
    $('.filter_area dd a').click(function(){
        $('body').toggleClass('open_filter');
        $(this).toggleClass('on');
        $('.filter_box').toggle();
        $('.filterDim').toggle();
    });

    // 체크박스 선택
    $.fn.listSelect = function(key) {
        $('input[name='+key+']').each(function() {
            if($(this).is(':checked')) {
                $(this).parents('li').addClass('on');
            }
        });

        // 전체선택/해제
        $('#list-all-checkbox').click(function() {
            if($(this).is(':checked')) {
                $('input[name='+key+']').prop('checked', true);
                $('input[name='+key+'][disabled]').prop('checked', false);
                $(this).parents('ol').find('li:not(:first-of-type)').addClass('on');
            } else {
                $('input[name='+key+']').prop('checked', false);
                $(this).parents('ol').find('li:not(:first-of-type)').removeClass('on');
            }
        });

        // 개별선택/해제
        $('input[name='+key+']').click(function() {
            if(!$(this).is(':checked')) {
                $('#list-all-checkbox').prop('checked', false);

                $(this).parents('li').removeClass('on');
            } else {
                var all_chk = true;
                $('input[name='+key+']').each(function() {
                    if (!$(this).is(':disabled') && !$(this).is(':checked')) all_chk = false;
                });
                if(all_chk == true) $('#list-all-checkbox').prop('checked', true);

                $(this).parents('li').addClass('on');
            }
        });
    };

    //휴대폰 마스킹처리
    $(document).on('keyup', '[data-phone-mask]', function() {
        $(this).val(autoHypenPhone($(this).val()));
    });

    // 치환코드
    $.fn.subsCode = function(name) {
        //치환코드 보기/닫기
        $('.btn-template-code').on('click', function() {
            var display = $(this).data('display');
            if(display == 'hide') {
                $(this).data('display', 'show').html('치환코드 닫기');
            } else if(display == 'show') {
                $(this).data('display', 'hide').html('치환코드 보기');
            }
            $('.template_subs_area').toggle();
        });

        //치환코드 삽입
        $('.btn-template-subs-ins').on('click', function() {
            var code = $(this).data('code');

            $('textarea[name='+name+']').val(function() {
                return this.value + code;
            });
        });
    };

    //문자 길이 검사 (bytes)
    $.fn.msgLenInspect = function(id) {
        $('#'+id).keyup(function(e) {
            if($(this).val().strlen() > 2000) {
                $(this).val(cutByLen($(this).val(), 2000));
                return false;
            }

            var byte = $(this).val().strlen();
            len_set('msg', byte);
            $('.sms-input textarea').focus();
        });
    };
});
