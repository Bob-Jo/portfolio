//회원 리스트 로드
function user_list_load(uri)
{
    var offset = '';
    var frm_id = $("#user_frm");
    var frm_data = frm_id.serialize();

    if(!uri) uri = '/hosting/user_modal_list?' + frm_data;

    $.ajax({
        type: 'GET',
        url: uri,
        dataType: 'html',
        async: true,
        cache: false,
        processData: true,
        beforeSend : function(jqXHR) {
        },
        success: function(res) {
            $(".user_list").html(res);
        },
        error: function(res) {
            if(res.responseText) {
                swal(res.responseText, "", "warning");
            }
        }
    });
}

// 회원 선택/삭제 모듈
var detachEmpty;
var user_module = function() {

    // 콤마 처리
    var _addcomma = function(nStr) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }

        return x1 + x2;
    };

    // 추가 공통처리부
    var _produceProc = function(user) {
        var cur_num = $(user.sel_tr_list).length;
        $(user.sel_tr_list).each(function() { // 이미 선택된 회원에 대한 리스트
            if($.inArray($(this).find('input').val(), user.sel_arr) === -1) {
                user.sel_arr.push($(this).find('input').val());
            }
        });

        return cur_num;
    };

    var _produceSet = function(list_num, user, userItem) {
        userItem.removeClass('on');
        userItem.find('td:eq(0)').find('input').attr('name', 'sel_key').prop('checked', false);
        userItem.find('td:eq(1)').html(++list_num);
        userItem.find('td:eq(5) button').data('mode', 'del_one').html('삭제');
        $(user.sel_list).append(userItem);

        $('.sel_cnt').html(_addcomma(list_num)+'명');

        return list_num;
    }

    // 삭제 공통처리부
    var _removeProc = function(user) {
        var cur_tr_list = $('.user_sel_list tbody.user_sel_list_body tr');
        var cur_len = cur_tr_list.length;

        $('.sel_cnt').html(_addcomma(cur_len)+'명');
        if(cur_len > 0) { // 일정 회원이 삭제되는 경우
            var list_cnt = 1;
            $(cur_tr_list).each(function() {
                $(this).find('td:eq(1)').html(list_cnt++);
            });
        } else { // 모든 회원 삭제되는 경우
            // $(user.sel_list).append($(detachEmpty)); // 빈 회원 처리 필요가 없어짐
        }
    };

    return {
        'init' : function() { // 초기화
            /* 빈 회원 처리 필요가 없어짐
            var empty = $('.user_sel_list_empty');
            if(empty.length) {
                detachEmpty = empty.detach();
            }
            */

            var data = {
                'list' : $('.user_list tbody.user_list_body tr').find('input:checked')
                , 'sel_list' : $('.user_sel_list tbody.user_sel_list_body')
                , 'sel_tr_list' : $('.user_sel_list tbody.user_sel_list_body tr')
                , 'sel_checked_list' : $('.user_sel_list tbody.user_sel_list_body tr').find('input:checked')
                , 'sel_arr' : new Array()
                , 'list_arr' : new Array()
            };

            return data;
        },
        'produce_one' : function(user, $this) { // 버튼형 회원추가
            var cur_num = _produceProc(user); // 추가 회원 공통 처리부
            var list_num = (cur_num > 0) ? Number(cur_num) : 0;
            var userItem = $this.parents('tr').clone();

            var sel_key = userItem.find('td:eq(0)').find('input').val();
            if($.inArray(sel_key, user.sel_arr) === -1) { // 이미 선택된 회원에 중복이 있는지 체크
                _produceSet(list_num, user, userItem); // 선택 회원 세팅
            }
        },
        'produce' : function(user) { // 체크박스 회원추가
            if($('input[name=key]:checked').length == 0) {
                swal('추가 할 회원을 선택해주세요.', "", "warning");
                _removeProc(user);
                return false;
            }

            if($(user.list).length > 0) {
                var userItem = null;

                var cur_num = _produceProc(user); // 추가 회원 공통 처리부
                var list_num = (cur_num > 0) ? Number(cur_num) : 0;
                $(user.list).each(function() { // 현재 선택된 회원에 대한 리스트
                    userItem = $(this).parents('tr').clone();
                    var sel_key = userItem.find('td:eq(0)').find('input').val();

                    if($.inArray(sel_key, user.list_arr) === -1) { // 현재 선택된 회원에 중복이 있는지 체크
                        user.list_arr.push(sel_key);

                        if($.inArray(sel_key, user.sel_arr) === -1) { // 이미 선택된 회원에 중복이 있는지 체크
                            list_num = _produceSet(list_num, user, userItem); // 선택 회원 세팅
                        }
                    }
                });
            }
        },
        'remove_one' : function(user, $this) { // 버튼형 회원삭제
            var userItem = $this.parents('tr').remove();

            _removeProc(user); // 삭제 회원 공통 처리부
        },
        'remove' : function(user) { // 체크박스 회원삭제
            if($('input[name=sel_key]:checked').length == 0) {
                swal('삭제 할 회원을 선택해주세요.', "", "warning");
                _removeProc(user);
                return false;
            }

            if($(user.sel_checked_list).length > 0) {
                $(user.sel_checked_list).each(function() { // 현재 선택된 회원에 대한 리스트
                    $(this).parents('tr').remove();
                });
            }

            _removeProc(user); // 삭제 회원 공통 처리부
        }
    };
};

$(function() {
    var user = new user_module();
    var data = {
        'mode' : ''
        , 'keys' : []
        , 'sms_y' : 0
        , 'sms_n' : 0
    };

    //검색갯수 선택
    $(document).on('change', '#limit-select', function() {
        $('input[type=hidden][name=limit]').val($(this).val());
        user_list_load('');
    });

    //회원 검색
    $(document).on('click', '#user_search', function() {
        user_list_load('');
    });

    //페이지네이션 비동기 처리
    $(document).on('click', '.page_area a.ajax-mode', function(e) {
        e.preventDefault();
        user_list_load($(this).attr('href'));
        return false;
    });

    //회원 검색 엔터
    $("input[name=srch_name]").keydown(function(key) {
        if(key.keyCode == 13) { //키가 13이면 실행 (엔터는 13)
            user_list_load('');
            return false;
        }
    });

    //전체선택/해제
    $(document).on('click', '#list-all-checkbox, #list-all-sel-checkbox', function() {
        var name = '';
        var id = $(this).attr('id');

        if(id == 'list-all-checkbox') name = 'key';
        else if(id == 'list-all-sel-checkbox') name = 'sel_key';
        else return false;

        if($(this).is(':checked')) {
            $('input[name='+name+']').prop('checked', true);
            $('input[name='+name+'][disabled]').prop('checked', false);
        } else {
            $('input[name='+name+']').prop('checked', false);
        }

        $('input[name='+name+']').each(function() {
            if($(this).is(':checked')) $(this).parents('tr').addClass('on');
            else $(this).parents('tr').removeClass('on');
        });
    });

    //단일선택/해제
    $(document).on('click', 'input[name=key], input[name=sel_key]', function() {
        var name = $(this).attr('name');
        var id = $(this).parents('table').find('thead input').attr('id');

        if(!$(this).is(':checked')) {
            $('#'+id).prop('checked', false);
            $(this).parents('tr').removeClass('on');
        } else {
            var all_chk = true;
            $('input[name='+name+']').each(function() {
                if (!$(this).is(':disabled') && !$(this).is(':checked')) all_chk = false;
            });
            if(all_chk == true) $('#'+id).prop('checked', true);
            $(this).parents('tr').addClass('on');
        }
    });

    //회원 추가/삭제
    $(document).on('click', '.btn-user-sel', function(e) {
        e.stopPropagation();
        e.stopImmediatePropagation();

        data.mode = $(this).data('mode');
        userInit = user.init();
        if(data.mode == 'add') {
            user.produce(userInit);
        } else if(data.mode == 'add_one') {
            user.produce_one(userInit, $(this));
        } else if(data.mode == 'del') {
            user.remove(userInit);
        } else if(data.mode == 'del_one') {
            user.remove_one(userInit, $(this));
        }
    });

    //회원선택완료
    $('.btn-user-modal-submit').on('click', function() {
        $('input[name=sel_key]').each(function() {
            data.keys.push($(this).data('uh_key'));
            if($(this).data('uh_sms_yn') == 'Y') data.sms_y++;
            else if($(this).data('uh_sms_yn') == 'N') data.sms_n++;
        });

        var each_user = $('.form_each_user');

        $(each_user).data('all_rows', data.sms_y+data.sms_n);
        $(each_user).data('allow_rows', data.sms_y);
        $(each_user).find(".text-users").html(data.sms_y);
        $(each_user).find(".text-reject-users").html(data.sms_n);
        $(each_user).find("input[name=user_each_sms_yn]").prop('checked', true);
        $("#smsForm").find("input[name=uh_keys]").val(data.keys);
    });
});
