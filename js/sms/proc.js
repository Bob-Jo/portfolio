$(function() {
    // 무통장입금 취소 처리 - PAGE : SMS 포인트 결제내역
    $('.btn-orders-proc').on('click', function(e) {
        e.preventDefault();
        var datas = {
            mode : $(this).data('mode')
            , hpo_key : $(this).data('hpo_key')
        };

        swal({
            title: '무통장 입금을 취소 하시겠습니까?',
            type: "info",
            showCancelButton: true,
            closeOnConfirm: false
        },
        function(isConfirm) {
            if(isConfirm)
            {
                $.ajax({
                    type: 'POST',
                    url: '/order/user_cancel',
                    data : datas,
                    dataType: 'json',
                    async: true,
                    cache: false,
                    processData: true,
                    beforeSend : function(jqXHR) {
                    },
                    success: function(res) {
                        if(res.rtv) {
                            swal({
                                title: '입금이 정상적으로 취소되었습니다',
                                type: "info",
                                showCancelButton: false,
                                closeOnConfirm: false
                            },
                            function(isConfirm) {
                                if(isConfirm)
                                {
                                    document.location.reload(true);
                                }
                            });
                        } else {
                            swal({
                                title: res.ret,
                                type: "error"
                            });
                        }
                    },
                    error: function(res) {
                        if(res.responseText) {
                            swal({
                                title: res.responseText,
                                type: "error"
                            });
                            document.location.reload(true);
                        }
                    }
                });
            }
        });
    });

    // 전체 재발송 - PAGE : SMS 발송내역 상세
    $('.btn-retry-all').click(function() {
        var ssg_key = $(this).data('ssg_key');

        swal({
            title: '전체 회원을 재발송 하시겠습니까?',
            type: "info",
            showCancelButton: true,
            closeOnConfirm: true
        },
        function(isConfirm) {
            if(isConfirm)
            {
                var data = {
                    uh_phone: []
                };

                $.ajax({
                    type: 'POST',
                    url: '/sms/sms_ps_send_json_list',
                    data : {
                        ssg_key : ssg_key
                    },
                    dataType: 'json',
                    async: true,
                    cache: false,
                    processData: true,
                    beforeSend : function(jqXHR) {
                    },
                    success: function(res) {
                        if(res.rtv) {
                            $(res.ret).each(function(idx, val) {
                                data.uh_phone.push(val.ss_dest_phone);
                            });

                            submitForm(data);
                        } else {
                            swal({
                                title: res.ret,
                                type: "error"
                            });
                        }
                    },
                    error: function(res) {
                        if(res.responseText) {
                            swal({
                                title: res.responseText,
                                type: "error"
                            });
                            document.location.reload(true);
                        }
                    }
                });
            }
        });
    });

    // 개별/선택재발송 - PAGE : SMS 발송내역 상세
    $('.btn-retry').click(function() {
        var mode = $(this).data('mode');
        var key = $(this).data('key');

        if(mode == 'retry_chk' && $('input[name=ss_key]:checked').length == 0) {
            swal({
                title: '회원을 선택해주세요.',
                type: 'error'
            });
            return false;
        }

        swal({
            title: '선택한 회원을 재발송 하시겠습니까?',
            type: "info",
            showCancelButton: true,
            closeOnConfirm: false
        },
        function(isConfirm) {
            if(isConfirm) {
                var data = {
                    uh_phone: []
                };

                if(mode == 'retry_chk') {
                    $('input[name=ss_key]:checked').each(function() {
                        data.uh_phone.push($(this).val());
                    });
                } else if(mode == 'retry_one') {
                    data.uh_phone.push(key);
                } else {
                    swal({
                        title: '데이터가 정상적이지 않습니다.',
                        type: 'error'
                    });
                    return false;
                }

                submitForm(data);
            }
        });
    });

    // 동적 폼 생성 및 전송
    var submitForm = function(data) {
        var $form = $('<form></form>');
        $form.attr('action', '/sms/sms_ps_send');
        $form.attr('method', 'POST');
        $form.appendTo('body');

        var uh_phone = $('<input type="hidden" value="'+data.uh_phone+'" name="uh_phone">');

        $form.append(uh_phone);
        $form.submit();
    }

    // 템플릿 수정/삭제 - PAGE : SMS 템플릿
    $('.btn-template-proc').on('click', function() {
        var datas = {
            mode : $(this).data('mode')
            , sst_key : $(this).data('sst_key')
        }

        if(datas.mode == 'del') { // 템플릿 삭제
            swal({
                title: '삭제 하시겠습니까?',
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false
            },
            function(isConfirm) {
                if(isConfirm)
                {
                    $.ajax({
                        type: 'POST',
                        url: '/sms/sms_ps_template_proc',
                        data : datas,
                        dataType: 'json',
                        async: true,
                        cache: false,
                        processData: true,
                        beforeSend : function(jqXHR) {
                        },
                        success: function(res) {
                            if(res.rtv) {
                                document.location.reload(true);
                            } else {
                                swal({
                                    title: res.msg,
                                    type: "error"
                                });
                            }
                        },
                        error: function(res) {
                            if(res.responseText) {
                                swal({
                                    title: res.responseText,
                                    type: "error"
                                });
                                document.location.reload(true);
                            }
                        }
                    });
                }
            });
        } else { // 템플릿 수정
            var $form = $('<form></form>');
            $form.attr('action', '/sms/sms_ps_template_form');
            $form.attr('method', 'POST');
            $form.appendTo('body');

            var mode = $('<input type="hidden" value="'+datas.mode+'" name="mode">');
            var sst_key = $('<input type="hidden" value="'+datas.sst_key+'" name="sst_key">');

            $form.append(mode).append(sst_key);
            $form.submit();
        }
    });

    // 비동기 처리 - PAGE : SMS 템플릿 폼
    $('#templateForm').ajaxForm({
        dataType: 'json',
        success: function(res) {
            if(!res.rtv) swal("처리 결과", res.msg, "info");
            else location.href = '/sms/sms_ps_template_list';
        },
        error: function(res) {
            if(res.responseText) {
                swal(res.responseText, "", "error");
            }
        }
    });

    // 유효성 검사 - PAGE : SMS 템플릿 폼
    var template_validate_options = {
        rules : {
            sst_type : { required : true }
            , sst_title : { required : true, maxlength : 20 }
            , sst_msg : { required : true, maxlength : 2000 }
        }
        , messages: {
            sst_type : "등록영역을 선택해주세요."
            , sst_title : {
                required : "템플릿 제목을 입력해주세요."
                , maxlength : "템플릿 제목은 최대 {0}자까지 입력 가능합니다."
            }
            , sst_msg : {
                required : "발송 내용을 입력해주세요."
                , maxlength : "발송 내용은 최대 {0}자까지 입력 가능합니다."
            }
        }
        , errorPlacement: function (error, element) {
        }
        , invalidHandler: function (form, validator) {
            var errors = validator.numberOfInvalids();
            if(errors) {
                swal(validator.errorList[0].message, "", "warning");
                validator.errorList[0].element.focus();
            }
        }
    };
    $('#templateForm').validate($.extend($.default_validate, template_validate_options))

    // 템플릿 등록/수정 - PAGE : SMS 템플릿 폼
    var template_submit_func = function() {
        if($('#templateForm').valid()) {
            swal({
                title: '적용 하시겠습니까?',
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false
            },
            function(isConfirm) {
                if(isConfirm) {
                    $('#templateForm').submit();
                }
            });
        }
        $('.template_submit_btn').one('click', template_submit_func);
    };
    $('.template_submit_btn').one('click', template_submit_func);

    //비동기 처리 - PAGE : SMS 발송
    $('#smsForm').ajaxForm({
        dataType: 'json',
        success: function(res) {
            if(!res.rtv) swal("처리 결과", res.msg, "info");
            else location.href = '/sms/sms_ps_rcv_list';
        },
        error: function(res) {
            if(res.responseText) {
                swal(res.responseText, "", "error");
            }
        }
    });

    //유효성 검사 - PAGE : SMS 발송
    var sms_validate_options = {
        rules : {
            callback : { required : true }
            , target : { required : true }
            , msg : { required : true, maxlength : 2000 }
        }
        , messages: {
            callback : "발신번호를 선택해주세요."
            , target : "수신대상을 선택해주세요."
            , msg : {
                required : "메시지를 입력해주세요."
                , maxlength : "메시지는 최대 {0}자까지 입력 가능합니다."
            }
        }
        , errorPlacement: function (error, element) {
        }
        , invalidHandler: function (form, validator) {
            var errors = validator.numberOfInvalids();
            if(errors) {
                swal(validator.errorList[0].message, "", "warning");
                validator.errorList[0].element.focus();
            }
        }
    };
    $('#smsForm').validate($.extend($.default_validate, sms_validate_options))

    //SMS 발송 - PAGE : SMS 발송
    var submit_func = function() {
        if($('#smsForm').valid()) {
            //필수값 체크
            var valid_msg = '';

            var target = $('input:radio[name=target]:checked').val();
            var rcv_data = [];
            if(target == 'T') {
                var rcv_list = $(".form_direct").find('dl dd p');
                if(rcv_list.length > 0) {
                    // 휴대폰번호 검증
                    $('span.form-rcv-phone').each(function() {
                        if($(this).html() == '') {
                            valid_msg = '수신번호를 입력해주세요.';
                            return false;
                        }

                        var rgEx = /(01[016789])[-](\d{4}|\d{3})[-]\d{4}$/g;
                        var chkFlg = rgEx.test($(this).html());
                        if(!chkFlg) {
                            valid_msg = '정확한 휴대폰번호가 아닙니다.';
                            return false;
                        }

                        rcv_data.push($(this).html());
                    });
                } else valid_msg = '수신번호를 등록해주세요.';
            } else if(target == 'I') {
                var user_cnt = $('.form_each_user .text-users').html();
                user_cnt = Number(user_cnt);
                if(isNaN(user_cnt) || user_cnt < 1) {
                    valid_msg = '수신 가능한 회원이 없습니다.';
                }

                var key_list = $('input[name=uh_keys]').val();
                if(!key_list) {
                    valid_msg = '수신 가능한 회원을 선택해주세요.';
                }
            } else if(target == 'A') {
                var user_cnt = $('.form_all_user .text-users').html();
                user_cnt = Number(user_cnt);
                if(isNaN(user_cnt) || user_cnt < 1) {
                    valid_msg = '수신 가능한 회원이 없습니다.';
                }
            } else if(target == 'X' && $('input[name=rcv_phone_excel]').get(0).files.length === 0) {
                valid_msg = '엑셀 파일을 업로드해주세요.';
            } else if(target == 'R') {
                var rcv_list = $(".form_reserve_user").find('dl dd p');
                if(rcv_list.length > 0) {
                    // 휴대폰번호 검증
                    $('span.form-reserve-phone').each(function() {
                        if($(this).html() == '') {
                            valid_msg = '수신번호를 입력해주세요.';
                            return false;
                        }

                        var rgEx = /(01[016789])[-](\d{4}|\d{3})[-]\d{4}$/g;
                        var chkFlg = rgEx.test($(this).html());
                        if(!chkFlg) {
                            valid_msg = '정확한 휴대폰번호가 아닙니다.';
                            return false;
                        }

                        rcv_data.push($(this).html());
                    });
                } else valid_msg = '예약대상을 선택해주세요.';
            } else if($.inArray(target, new Array('T','I','A','X','R')) == -1) {
                valid_msg = '수신대상을 선택해주세요.';
            }

            var left_point = Number($('.ps_left_point').data('left_point'));
            if(!left_point) valid_msg = '포인트를 충전 후 발송해주세요.';

            if(valid_msg)
            {
                swal(valid_msg, "", "warning");
            } else {
                swal({
                    title: '발송 하시겠습니까?',
                    type: "info",
                    showCancelButton: true,
                    closeOnConfirm: false
                },
                function(isConfirm) {
                    if(isConfirm) {
                        $('<input>').attr({type: 'hidden', name: 'rcv_data', value:JSON.stringify(rcv_data)}).appendTo($('#smsForm'));
                        $('#smsForm').submit();
                    }
                });
            }
        }
        $('.sms_submit_btn').one('click', submit_func);
    };
    $('.sms_submit_btn').one('click', submit_func);
});
