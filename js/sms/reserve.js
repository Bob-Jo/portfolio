//예약회원 리스트 로드
function reserve_user_list_load(uri)
{
    var offset = '';
    var frm_id = $("#reserve_user_frm");
    var frm_data = frm_id.serialize();

    if(!uri) uri = '/reserve/reserve_user_modal_list?' + frm_data;

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
            $(".reserve_user_list").html(res);
        },
        error: function(res) {
            if(res.responseText) {
                swal(res.responseText, "", "warning");
            }
        }
    });
}

var realtime_chk_cnt = function(name) {
    var sel_cnt = Number($('input[name='+name+']:checked').length);
    $('.list_pick_sel').html(sel_cnt+'명');
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
    });

    //예약회원 검색
    $(document).on('click', '#reserve_user_search', function() {
        $('input[type=hidden][name=srch_from]').val($("#reserve_user_frm").find("input[name=srch_from_chk]").val());
        $('input[type=hidden][name=srch_to]').val($("#reserve_user_frm").find("input[name=srch_to_chk]").val());
        reserve_user_list_load('');
    });

    //전체선택/해제
    $(document).on('click', '#list-all-checkbox', function() {
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

        realtime_chk_cnt(name);
    });

    //단일선택/해제
    $(document).on('click', 'input[name=key]', function() {
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

        realtime_chk_cnt(name);
    });

    //회원선택완료
    $('.btn-reserve-modal-submit').on('click', function() {
        var sms_val_txt = '';
        var data = {
            'keys' : []
            , 'srch_from' : $("#reserve_user_frm").find("input[name=srch_from]").val()
            , 'srch_to' : $("#reserve_user_frm").find("input[name=srch_to]").val()
        };

        var u_phone_list = new Array();
        $('input[name=key]:checked').each(function() {
            data.keys.push($(this).data('key'));
            sms_val_txt += "<p><span class='form-reserve-phone'>"+autoHypenPhone($(this).val())+"</span><button type='button' class='btn-form-reserve-del'></button></p>";
        });

        $('.form_reserve_user .sms_add_box').find('dl dd').empty().append(sms_val_txt);
        $('.rcv_reserve_cnt').html($('input[name=key]:checked').length+' 명');
        $("#smsForm").find("input[name=o_keys]").val(data.keys);
        $("#smsForm").find("input[name=srch_from]").val(data.srch_from);
        $("#smsForm").find("input[name=srch_to]").val(data.srch_to);
    });
});
