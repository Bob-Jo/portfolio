$(function() {
    $('.input-daterange').datepicker({
        language: "kr"
        , format: 'yyyy.mm.dd'
        , toggleActive: true
        , keyboardNavigation: false
        , forceParse: false
        , autoclose: true
    })

    //검색갯수 선택
    $(document).on('change', '#limit-select', function(e) {
        $('input[type=hidden][name=limit]').val($(this).val());
        $('#search_btn').trigger('click');
    });

    $('#search_btn').click(function(e){
        e.preventDefault();
        var form = $(this).parents("form");
        $(form).submit();
    });

    $('.filter_area dd a').click(function(){
        $('body').toggleClass('open_filter');
        $(this).toggleClass('on');
        $('.filter_box').toggle();
        $('.filterDim').toggle();
    });
});
