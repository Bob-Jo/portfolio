//템플릿 리스트 로드
function template_list_load(uri)
{
    var offset = '';
    var frm_id = $("#smsForm");
    var frm_data = frm_id.serialize();

    if(!uri) uri = '/sms/sms_ps_template_search_list?' + frm_data;

    $.ajax({
        type: 'GET',
        url: uri,
        dataType: 'html',
        async: true,
        cache: false,
        beforeSend : function(jqXHR) {
        },
        success: function(res) {
            $(".template_list").html(res);
        },
        error: function(res) {
            if(res.responseText) {
                swal(res.responseText, "", "error");
            }
        }
    });
}

var set_target = function(target) {
    $('.form_rcv').hide();
    if(target == 'T') $('.form_direct').show();
    else if(target == 'I') $('.form_each_user').show();
    else if(target == 'A') $('.form_all_user').show();
    else if(target == 'X') $('.form_excel').show();
    else if(target == 'R') $('.form_reserve_user').show();

    if(target == 'I' || target == 'A') {
        $('.btn-template-code').show();
        $('.txt_template_code').hide();
    } else {
        $('.btn-template-code, .template_subs_area').hide();
        $('.txt_template_code').show();
    }
};

$(function() {
    //템플릿 삽입
    $(document).on('click', '.btn-template-ins', function() {
        var cur_msg = $('textarea[name=msg]').val();
        $('textarea[name=msg]').val(cutByLen(cur_msg+$(this).data('msg'), 2000));
        len_set('msg', $('#sms_msg').val().strlen());
    });

    //템플릿 변경
    $('select[name=sst_type]').on('change', function() {
        if($(this).val() != '') {
            $('input[type=hidden][name=sst_type]').val($(this).val());
            template_list_load('');
        } else $(".template_list").empty();
    });

    //페이지네이션 비동기 처리
    $(document).on('click', '.page_area a.temp-ajax-mode', function(e) {
        e.preventDefault();
        template_list_load($(this).attr('href'));
        return false;
    });

    //수신대상 변경
    $('input:radio[name=target]').on('change', function() {
        set_target($(this).val());
    });

    //문자 수신 번호 추가 (직접입력)
    $(document).on('click', '#append_btn', function() {
        var rcv_phone = $('input[name=rcv_phone]').val();
        var rgEx = /(01[016789])[-](\d{4}|\d{3})[-]\d{4}$/g;
        var chkFlg = rgEx.test(rcv_phone);
        if(!chkFlg) {
            swal("정확한 휴대폰번호가 아닙니다.", "", "warning");
            return false;
        }

        // 휴대폰번호 검증
        var valid_msg = '';
        $('span.form-rcv-phone').each(function() {
            if($(this).html() == rcv_phone) {
                valid_msg = '중복되는 휴대폰번호가 있습니다.';
                return false;
            }
        });

        if(valid_msg) {
            swal(valid_msg, "", "warning");
            return false;
        }

        var rcv_cnt = Number($('.rcv_direct_cnt').html().replace(' 명',''));
        var sms_val_txt = "<p><span class='form-rcv-phone'>"+rcv_phone+"</span><button type='button' class='btn-form-rcv-del'></button></p>";

        var $this = $(this).parents('.sms_add_box').find('dl dd');
        $this.append(sms_val_txt).scrollTop($this[0].scrollHeight);
        $('input[name=rcv_phone]').val('');
        $('.rcv_direct_cnt').html(++rcv_cnt+' 명');
    });

    //문자 수신 번호 삭제 (직접입력/예약회원)
	$(this).on('click', '.btn-form-rcv-del, .btn-form-reserve-del', function() {
        var type = $(this).attr('class');

        var cnt_class;
        if(type == 'btn-form-rcv-del') cnt_class = '.rcv_direct_cnt';
        else if(type == 'btn-form-reserve-del') cnt_class = '.rcv_reserve_cnt';

        var rcv_cnt = Number($(cnt_class).html().replace(' 명',''));
		$(this).parents('p').remove();
        $(cnt_class).html(--rcv_cnt+' 명');
	});

    //수신동의회원 체크 (전체회원/개별회원 기준)
    $('input:checkbox[name=user_sms_yn], input:checkbox[name=user_each_sms_yn]').on('change', function() {
        var name = $(this).attr('name');

        var type;
        if(name == 'user_sms_yn') type = '.form_all_user';
        else if(name == 'user_each_sms_yn') type = '.form_each_user';

        var all_rows = $(type).data('all_rows');
        var allow_rows = $(type).data('allow_rows');

        if(this.checked) {
            $(type).find('.text-users').text(allow_rows);
            this.value = 'Y';
        } else {
            $(type).find('.text-users').text(all_rows);
            this.value = '';
        }
    });

    //개별회원 선택 팝업
    $("#each_user").on('click', function() {
        $.fn.openModal({
            method: 'POST',
            backdrop: 'static', // 배경클릭 닫기 제한
            url: '/sms/sms_ps_send_modal_form',
            data: {
                uh_keys : $('input[name=uh_keys]').val()
            }
        });
    });

    //예약회원 선택 팝업
    $("#reserve_user").on('click', function() {
        $.fn.openModal({
            method: 'POST',
            backdrop: 'static', // 배경클릭 닫기 제한
            url: '/sms/sms_ps_reserve_modal_form',
            data: {
                o_keys : $('input[name=o_keys]').val()
                , srch_from : $('input[name=srch_from]').val()
                , srch_to : $('input[name=srch_to]').val()
            }
        });
    });

    //엑셀업로드 삭제
    $('.fileinput-remove').on('click', function() {
        if(navigator.userAgent.match(/MSIE ([0-9]+)\./)) { //IE version
            $('#rcv_phone_excel').replaceWith($('#rcv_phone_excel').clone(true));
        } else { //other browser
            $('#rcv_phone_excel').val('');
        }
        $('#fileSms').val('');
    });
});
