// 사업자번호 유효성 체크
function checkBizID(bizID) {
    // bizID는 숫자만 10자리로 해서 문자열로 넘긴다.
    var checkID = new Array(1, 3, 7, 1, 3, 7, 1, 3, 5, 1);
    var tmpBizID, i, chkSum=0, c2, remander;
    var result;

    bizID = bizID.replace(/-/gi,'');

    for(i=0; i<=7; i++) chkSum += checkID[i] * bizID.charAt(i);

    c2 = "0" + (checkID[8] * bizID.charAt(8));
    c2 = c2.substring(c2.length - 2, c2.length);
    chkSum += Math.floor(c2.charAt(0)) + Math.floor(c2.charAt(1));
    remander = (10 - (chkSum % 10)) % 10 ;

    if(Math.floor(bizID.charAt(9)) == remander) result = true ; // OK!
    else result = false;

    return result;
}

$(function() {
    // 신용카드 결제하기
    payment_request = function() {
        var pg = $(this).data('pg');
        var payment = $(this).data('payment');

        //상품 선택
        if($('input[name=hpg_key]').is(':checked') !== true)
        {
            swal({
                title: '충전하실 상품을 선택해주세요.',
                type: "error"
            });
            return false;
        }

        var $hpg_key = $('input[name=hpg_key]:checked');
        var _hpg_key = (typeof $hpg_key.data('hpg_key') == 'undefined') ? '' : $hpg_key.data('hpg_key');
        var _hpgi_key = (typeof $hpg_key.data('hpgi_key') == 'undefined') ? '' : $hpg_key.data('hpgi_key');
        var _hpgi_price = (typeof $hpg_key.data('hpgi_price') == 'undefined') ? '' : $hpg_key.data('hpgi_price');
        var _hpgi_qty = (typeof $hpg_key.data('hpgi_qty') == 'undefined') ? '' : $hpg_key.data('hpgi_qty');

        var datas = {
            hpo_pg_type : pg
            , hpo_pay_type : payment
            , hpg_key : _hpg_key
            , hpgi_key : _hpgi_key
            , hpgi_price : _hpgi_price
            , hpgi_qty : _hpgi_qty
        }

        if(payment == 'untouched') {
            $.fn.openModal({
                method: 'POST',
                url: '/sms/sms_ps_modal_form',
                data: datas
            });
        } else {
            swal({
                title: '결제를 진행 하시겠습니까?',
                type: "info",
                showCancelButton: true,
                closeOnConfirm: true
            },
            function(isConfirm) {
                if(isConfirm)
                {
                    if(os_type == 'W') { // PC 결제
                        $.ajax({
                            type: 'POST',
                            url: '/order/request',
                            dataType: 'json',
                            async: true,
                            cache: false,
                            data: JSON.stringify(datas),
                            contentType: 'application/json; charset=utf-8',
                            beforeSend : function(jqXHR) {
                            },
                            success: function(res) {
                                if(res.rtv) {
                                    setTimeout(function() {
                                        $('#exec-wrap').html(res.exec);
                                    }, 100);
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
                                    location.reload(true);
                                }
                            }
                        });
                    } else { // MOBILE/APP 결제
                        localStorage.setItem('orders_set', JSON.stringify(datas));
                        location.href = '/order/request_bridge';
                    }
                }
            });
        }
    };

    $('.pay-btn').on('click', payment_request);

    // 무통장 결제하기
    untouched_payment_request = function() {
        if($('input[name=cash_yn]:checked').val() == 'Y')
        {
            if($('input[name=hpo_cash_purpose]:checked').val() == '') {
                swal({
                    title: '현금영수증 용도를 선택해주세요.',
                    type: "error"
                });
                return false;
            }

            if($('select[name=hpo_cash_type]').val() == '') {
                swal({
                    title: '현금영수증 구분을 선택해주세요.',
                    type: "error"
                });
                return false;
            }

            if($('input[name=hpo_cash_id]').val() == '') {
                swal({
                    title: '현금영수증 등록번호를 입력해주세요.',
                    type: "error"
                });
                return false;
            } else {
                var $hpo_cash_type = $('select[name=hpo_cash_type]').val();
                if($hpo_cash_type == '4') { // 휴대폰번호 유효성
                    var rgEx = /(01[016789])(\d{7}|\d{8})$/g;
                    var chkFlg = rgEx.test($('input[name=hpo_cash_id]').val());
                    if(!chkFlg) {
                        swal({
                            title: '정확한 휴대폰번호가 아닙니다.',
                            type: "error"
                        });
                        return false;
                    }
                } else if($hpo_cash_type == '2') { // 주민번호 유효성
                    var rgEx = /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))[1-4][0-9]{6}$/g;
                    var chkFlg = rgEx.test($('input[name=hpo_cash_id]').val());
                    if(!chkFlg) {
                        swal({
                            title: '정확한 주민번호가 아닙니다.',
                            type: "error"
                        });
                        return false;
                    }
                } else if($hpo_cash_type == '3') { // 사업자번호 유효성
                    var chkFlg = checkBizID($('input[name=hpo_cash_id]').val());
                    if(!chkFlg) {
                        swal({
                            title: '정확한 사업자번호가 아닙니다.',
                            type: "error"
                        });
                        return false;
                    }
                }
            }
        }

        var _hpo_pg_type = (typeof $(this).data('hpo_pg_type') == 'undefined') ? '' : $(this).data('hpo_pg_type');
        var _hpo_pay_type = (typeof $(this).data('hpo_pay_type') == 'undefined') ? '' : $(this).data('hpo_pay_type');
        var _hpg_key = (typeof $(this).data('hpg_key') == 'undefined') ? '' : $(this).data('hpg_key');
        var _hpgi_key = (typeof $(this).data('hpgi_key') == 'undefined') ? '' : $(this).data('hpgi_key');
        var _hpgi_price = (typeof $(this).data('hpgi_price') == 'undefined') ? '' : $(this).data('hpgi_price');
        var _hpgi_qty = (typeof $(this).data('hpgi_qty') == 'undefined') ? '' : $(this).data('hpgi_qty');
        var _hpo_cash_yn = $('input[name=cash_yn]:checked').val();
        var _hpo_cash_purpose = $('input[name=hpo_cash_purpose]:checked').val();
        var _hpo_cash_type = $('select[name=hpo_cash_type]').val();
        var _hpo_cash_id = $('input[name=hpo_cash_id]').val();
        var _hpo_pay_bank = (typeof $(this).data('hpo_pay_bank') == 'undefined') ? '' : $(this).data('hpo_pay_bank');
        var _hpo_cash_save_yn = (typeof $('input[name=cash_save_yn]:checked').val() == 'undefined') ? '' : $('input[name=cash_save_yn]:checked').val();

        var datas = {
            hpo_pg_type : _hpo_pg_type
            , hpo_pay_type : _hpo_pay_type
            , hpg_key : _hpg_key
            , hpgi_key : _hpgi_key
            , hpgi_price : _hpgi_price
            , hpgi_qty : _hpgi_qty
            , hpo_cash_yn : _hpo_cash_yn
            , hpo_cash_purpose : _hpo_cash_purpose
            , hpo_cash_type : _hpo_cash_type
            , hpo_cash_id : _hpo_cash_id
            , hpo_pay_bank : _hpo_pay_bank
            , hpo_cash_save_yn : _hpo_cash_save_yn
        }

        swal({
            title: '결제 하시겠습니까?',
            type: "info",
            showCancelButton: true,
            closeOnConfirm: true
        },
        function(isConfirm) {
            if(isConfirm)
            {
                $.ajax({
                    type: 'POST',
                    url: '/order/request',
                    dataType: 'json',
                    async: true,
                    cache: false,
                    data: JSON.stringify(datas),
                    contentType: 'application/json; charset=utf-8',
                    beforeSend : function(jqXHR) {
                    },
                    success: function(res) {
                        if(res.rtv) {
                            window.location.href = '/sms/sms_ps_point_list';
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
                            location.reload(true);
                        }
                    }
                });
            }
        });
    };

    $('.untouched-pay-btn').on('click', untouched_payment_request);
});
