var realtime_chk_cnt = function() {
    var sel_cnt = Number($('input[name=key]:checked').length);
    $('.list_pick_sel').html(sel_cnt+'명');

    var u_phone_list = new Array();
    $('input[name=key]:checked').each(function() {
        if($(this).data('u_phone') && $.inArray($(this).data('u_phone'), u_phone_list) === -1) {
            u_phone_list.push($(this).data('u_phone'));
        }
    });
    $('.list_sms_sel').html(u_phone_list.length+'명');
};

$(function() {
    // 전체선택해제
    $('#list-all-checkbox').click(function() {
        if ($(this).is(':checked')) {
            $('input[name=key]').prop('checked', true);
            $('input[name=key][disabled]').prop('checked', false);
            $(this).parents('table').find('tr:not(thead tr)').addClass('selected');
        } else {
            $('input[name=key]').prop('checked', false);
            $(this).parents('table').find('tr:not(thead tr)').removeClass('selected');
        }

        realtime_chk_cnt();
    });

    $('input[name=key]').click(function() {
        if (!$(this).is(':checked')) {
            $('#list-all-checkbox').prop('checked', false);
            $(this).parents('tr').removeClass('selected');
        } else {
            var all_chk = true;
            $('input[name=key]').each(function() {
                if (!$(this).is(':disabled') && !$(this).is(':checked')) all_chk = false;
            });
            if (all_chk == true) $('#list-all-checkbox').prop('checked', true);

            $(this).parents('tr').addClass('selected');
        }

        realtime_chk_cnt();
    });

    // 수정처리
    $(".btn_upt_proc").on("click", function() {
        var data = {
            mode : $(this).data('mode')
            , keys : []
        };
        data.keys.push($(this).data('key'));
        $.fn.openModal({
            method: 'POST',
            url: '/hosting/user_list_modal_form',
            data: data
        });
    });

    // 선택처리
    $(".btn_select_proc").on("click", function() {
        if($('input[name=key]:checked').length == 0) {
            swal({
                title: '처리할 회원을 선택해주세요.',
                type: "error"
            });
            return false;
        }

        var data = {
            mode : $(this).data('mode')
            , keys : []
        };
        $('input[name=key]:checked').each(function() {
            data.keys.push($(this).val());
        });

        if(data.mode == 'user') {
            $.fn.openModal({
                method: 'POST',
                url: '/hosting/user_list_modal_form',
                data: data
            });
        } else if(data.mode == 'sms') {
            swal({
                title: 'SMS발송 페이지로 이동 하시겠습니까?',
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false
            },
            function(isConfirm) {
                if(isConfirm) {
                    var $form = $('<form></form>');
                    $form.attr('action', '/sms/sms_ps_send');
                    $form.attr('method', 'POST');
                    $form.appendTo('body');

                    var uh_keys = $('<input type="hidden" value="'+data.keys+'" name="uh_keys">');

                    $form.append(uh_keys);
                    $form.submit();
                }
            });
        }
    });

    //회원처리상태 변경 - 회원처리 모달 팝업
    $('input:radio[name=uh_member_state]').on('change', function() {
        var state = $(this).val();
        if(state == '3') $('.comment_area').show();
        else $('.comment_area').hide();
    });

    //회원처리부 - 회원처리 모달 팝업
    var submit_func = function() {
        //필수값 체크
        var valid_msg = '';
        var uh_sms_yn = $('input:radio[name=uh_sms_yn]:checked').val();
        var uh_email_yn = $('input:radio[name=uh_email_yn]:checked').val();
        var uh_member_state = $('input:radio[name=uh_member_state]:checked').val();
        var uh_stop_comment = $('textarea[name=uh_stop_comment]').val();

        if(uh_member_state == '3' && uh_stop_comment == '') valid_msg = '활동중지 사유를 입력해주세요.';

        if(uh_sms_yn == '' || typeof uh_sms_yn == 'undefined') uh_sms_yn = '';
        if(uh_email_yn == '' || typeof uh_email_yn == 'undefined') uh_email_yn = '';
        if(uh_member_state == '' || typeof uh_member_state == 'undefined') uh_member_state = '';

        if(valid_msg) {
            swal(valid_msg, "", "warning");
        } else {
            swal({
                title: '적용 하시겠습니까?',
                type: "info",
                showCancelButton: true,
                closeOnConfirm: true
            },
            function(isConfirm){
                if (isConfirm) {
                    $.ajax({
                        type: 'POST',
                        url: '/hosting/user_proc',
                        data: {
                            uh_keys : uh_keys
                            , uh_sms_yn : uh_sms_yn
                            , uh_email_yn : uh_email_yn
                            , uh_member_state : uh_member_state
                            , uh_stop_comment : uh_stop_comment
                        },
                        dataType: 'json',
                        async: true,
                        cache: false,
                        processData: true,
                        beforeSend : function(jqXHR) {
                        },
                        success: function(res) {
                            if(!res.rtv) swal("처리에 문제가 있습니다.", res.ret, "warning");
                            else window.location.reload();
                        },
                        error: function(res) {
                            if(res.responseText) {
                                swal(res.responseText, "", "error");
                            }
                        }
                    });
                }
            });
        }

        $('.submit_btn').one('click', submit_func);
    };
    $('.submit_btn').one('click', submit_func);
});
