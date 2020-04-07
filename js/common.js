//비밀번호 영문,숫자,특수문자 허용
$.validator.addMethod("passwordChk", function(value, element) {
    return this.optional(element) || /^.*(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/.test(value);
});

//닉네임 한글,숫자,영문만 가능
$.validator.addMethod("specialCharacterChk", function(value, element) {
    return this.optional(element) || /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\*]+$/.test(value);
});

$.validator.addMethod("byteRangeLength", function(value, element, param) {
    var length = value.length;
    for (var i = 0; i < value.length; i++) {
        if (value.charCodeAt(i) > 127) {
            length++;
        }
    }
    return this.optional(element) || (length >= param[0] && length <= param[1]);
}, $.validator.format("한글은 2-6자, 영문은 {0}-{1}자 사이로 입력이 가능합니다."));

//문자 바이트 체크
String.prototype.strlen = function() {
    var relen = this.length;
    var len = this.length;
    for (var i = 0; i < len; i++)
        if (this.charCodeAt(i) > 128) relen++;
    return relen;
};

//숫자 3자리 콤마
function commaSeparateNumber(val)
{
	while (/(\d+)(\d{3})/.test(val.toString())){
		val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	}
	return val;
}

//전화번호 양식
function phoneFomatter(num, type) {
    var formatNum = '';
    if (num.length == 11) {
        if (type === 0) {
            formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
        } else {
            formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        }
    } else if (num.length == 8) {
        formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2');
    } else {
        if (num.indexOf('02') === 0) {
            if (type === 0) {
                formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-****-$3');
            } else {
                formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
            }
        } else {
            if (type === 0) {
                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3');
            } else {
                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            }
        }
    }
    return formatNum;
}

//자동 -
function autoHypenPhone(str) {
    str = str.replace(/[^0-9]/g, '');
    var tmp = '';
    if (str.length < 4) {
        return str;
    } else if (str.length < 7) {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3);
        return tmp;
    } else if (str.length == 10 && str.substr(0, 2) == '02') {
        tmp += str.substr(0, 2);
        tmp += '-';
        tmp += str.substr(2, 4);
        tmp += '-';
        tmp += str.substr(6);
        return tmp;
    } else if (str.length < 11) {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 3);
        tmp += '-';
        tmp += str.substr(6);
        return tmp;
    } else {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 4);
        tmp += '-';
        tmp += str.substr(7);
        return tmp;
    }
    return str;
}


function onlyNumber() {
	if((event.keyCode > 31) && (event.keyCode < 45) || (event.keyCode > 57)) {
		event.returnValue = false;
		alert("숫자만 입력해 주세요.");
	}
}
function onlyNumber2(loc) {
	if(/[^0123456789]/g.test(loc.value)) {
		alert("숫자만 입력해 주세요.");
		loc.value = "";
		loc.focus();
	}
}

// 클립보드 복사
window.Clipboard = (function(window, document, navigator) {
    var textArea, copy;

    function isOS() {
        return navigator.userAgent.match(/ipad|iphone/i);
    }

    function createTextArea(text) {
        textArea = document.createElement('textArea');
        textArea.value = text;
        document.body.appendChild(textArea);
    }

    function selectText() {
        var range, selection;

        if(isOS()) {
            range = document.createRange();
            range.selectNodeContents(textArea);
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            textArea.setSelectionRange(0, 999999);
        } else {
            textArea.select();
        }
    }

    function copyToClipboard() {
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    copy = function(text) {
        createTextArea(text);
        selectText();
        copyToClipboard();
    };

    return {
        copy: copy
    };
})(window, document, navigator);

// 페이지 처리
var page_proc = function(){

    // 이미지 에러 대체 이미지
    $('body').imagesLoaded()
    .always( function( instance ) {
        //console.log('all images loaded');
    })
    .done( function( instance ) {
        //console.log('all images successfully loaded');
    })
    .fail( function( instance ) {
        //console.log('all images loaded, at least one is broken');
        $.each(instance.images, function(k,v){
            if(v.isLoaded === false){
                if($(v.img).hasClass('profile')){
                    $(v.img).attr('src', '/asset/admin/img/no_profile.png');
                }else{
                    $(v.img).attr('src', '/asset/common/img/low_404image.png');
                }
                $(v.img).css('background-color', '#f7f7f7');
            }
        });
        $('body').trigger('image-fail');
    })
    .progress( function(instance, image) {
        var result = image.isLoaded ? 'loaded' : 'broken';
        //console.log( 'image is ' + result + ' for ' + image.img.src );
    });

    // Tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // input mask 적용
    $("[data-mask]").inputmask();
    $(document).ajaxComplete(function(){
        $("[data-mask]").inputmask();
    });

    $("[data-phone-mask]").keyup(function() {
        $(this).val(autoHypenPhone($(this).val()));
    });

    $("[data-number-mask]").inputmask({
        alias:'decimal'
        , groupSeparator:''
        , autoGroup:true
    });

    $(this).on("keyup", ".data-number-mask", function(){
        var regexp = /[^0-9]/g
        var v = $(this).val();
        $(this).val(v.replace(regexp,''));
    });

    var browser = {
        isIe: function () {
            return navigator.appVersion.indexOf("MSIE") != -1;
        },
        navigator: navigator.appVersion,
        getVersion: function() {
            var version = 999; // we assume a sane browser
            if (navigator.appVersion.indexOf("MSIE") != -1)
                // bah, IE again, lets downgrade version number
                version = parseFloat(navigator.appVersion.split("MSIE")[1]);
            return version;
        }
    };

    $("[data-price-mask]").inputmask({
        alias:'decimal'
        , groupSeparator: (browser.isIe() && browser.getVersion() <= 9) ? '' : ',' // ie9 버전 이하에서 unmask 처리 불가로 인한 처리
        , autoGroup:true
        , autoUnmask:true // ajax submit or 검색시 unmask
        , removeMaskOnSubmit:true // form before submit unmask (ajax submit 처리 불가)
    });

    // i check 활성화
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-moolban',
        radioClass: 'iradio_square-moolban',
    });

    // sweet alert
    swal.setDefaults({
        type: 'warning'
        , confirmButtonText: '확인'
        , cancelButtonText: '취소'
    });

    // GIF 클릭시 재생
    $(document).on('click', 'img', function() {
        var src = $(this).attr('src');
        if (src.indexOf(".gif") > 0) {
            var rand = '';
            for (var i = 0; i < 5; i++) {
                rand += (Math.floor(Math.random() * 10));
            }
            $(this).attr('src', src + '?reload=' + rand);
        } else {
            //console.log('non gif');
        }
    });

    // 부트스트랩 미지원으로 내부 체크박스 보정
    $('label.btn').each(function() {
        if ($(this).hasClass('active')) {
            $(this).find('input').attr('checked', true);
        }
    });
    $('label.btn').change(function() {
        if (!$(this).hasClass('active')) {
            $(this).find('input').attr('checked', true);
        }
    });

    //텍스트 영역
    $(document).on('keydown keyup', "textarea.autosize", function () {
        $(this).height('12px').height( ($(this).prop('scrollHeight') + 12) + 'px' );
    });

    /* 알림내역 닫기 */
    $('#realtime_wrap .close_btn').click(function(){
        $('#realtime_wrap').empty();
    });

    //알림 삭제
    $('.btn-realtime-del').click(function(){
        e.preventDefault();
        var $this = $(this);
        var cr_namespace = $this.data("namespace");
        var cri_key = $this.data("key");
        var mode = $this.data("mode");

        if($("#realtime-list").find(".box").length)
        {
            if(mode && cr_namespace)
            {
                $.ajax({
                    type: 'POST',
                    url: '/system/realtime_items_proc',
                    data: {mode : mode, cr_namespace : cr_namespace, cri_key : cri_key},
                    dataType: 'json',
                    async: true,
                    cache: false,
                    processData: true,
                    beforeSend : function(jqXHR) {
                        //if(typeof(submit_ladda) != 'undefined') submit_ladda.ladda( 'start' );
                    },
                    success: function(res) {
                        //swal("", res.ret, "info");
                        if(!res.rtv) swal("처리에 문제가 있습니다.", res.ret, "warning");
                        else {
                            if(mode == 'all_del') realtime_blank();
                            else {
                                $this.parent().remove();
                                if(!$("#realtime-list").find(".box").length) realtime_blank();
                            }
                        }
                    },
                    error: function(res) {
                        if (res.responseText) {
                            swal(res.responseText, "", "error");
                            //location.reload(true);
                        }
                    }
                });
            } else {
                swal("접근에 문제가 있습니다.", "", "warning");
                return false;
            }
        } else {
            swal("삭제할 데이터가 존재하지 않습니다.", "", "info");
            return false;
        }
    });
};
$(document).ready(page_proc);
$(document).ajaxComplete(page_proc);


$(document).ready(function() {

    //counterup
    $('.counter').counterUp({
        delay: 10,
        time: 1000
    });

     $('.salesman_empty').click(function(e){
         e.preventDefault();
         swal("담당 영업사원이 없습니다.", "", "warning");
     });
});

(function($) {

    //로딩 이미지
    $.loading = function(parent,mode){
        switch (mode) {
            case 'start':
                $(parent).append('<div id="loading" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:9999;background:rgba(255, 255, 255, .7);display:none;cursor:wait;"><div style="top:40%;" class="sk-spinner sk-spinner-double-bounce"><div class="sk-double-bounce1"></div><div class="sk-double-bounce2"></div></div></div>');
                $('#loading').stop().fadeIn();
                break;
            case 'stop':
                $('#loading').stop().fadeOut(function(){
                    $('#loading').remove();
                });
                break;
        }
    };

    $.default_validate = {
        //debug : false,
        focusCleanup: true, //true이면 잘못된 필드에 포커스가 가면 에러를 지움
        focusInvalid: true, //유효성 검사후 포커스를 무효필드에 둠 꺼놓음

        onclick: false, //클릭시 발생됨 꺼놓음
        //onfocusout: false, //포커스가 아웃되면 발생됨 꺼놓음
        //onkeyup: false, //키보드 키가 올라가면 발생됨 꺼놓음

        //errorElement: 'span',
        //errorClass: 'invalid-text',

        highlight: function(element) {
            //.closest('.form-group')
            $(element).removeClass('success').addClass('error');
        },
        success: function(element) {
            $(element).siblings('.valid').removeClass('error').addClass('success');
            $(element).remove();
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element); // <- the default
        },
        onkeyup: function(element) {
            $(element).valid();
        },
        onfocusout: function(element) {
            $(element).valid();
        },
        showErrors: function(errorMap, errorList) {
            this.defaultShowErrors();
        },
        invalidHandler: function (form, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {
                //alert(validator.errorList[0].message);
                validator.errorList[0].element.focus();
                swal(validator.errorList[0].message, "", "warning");
            }
        }
    };

    //리스트 더보기 공용 함수
    $.list_more = function(parent, target_url, options){

    	// 더보기 부모 객체
    	var $parent = $(parent);

    	var default_options = {};

    	options = $.extend(default_options, options);

    	// 더보기 처리
    	var addMore = function(){
    		$.ajax({
    			type: 'POST',
    			async: true,
    			cache: false,
    			url: target_url,
    			dataType: 'json',
    			data: {
    				last_key : $parent.data('last_key'),
    				limit : $parent.data('limit'),
                    page : $parent.data('page'),
    				options : options
    			},
    			beforeSend: function(){
                    //"로딩중입니다."
                    $.loading(parent,'start');
    			},
    			success: function(data) {
                    //console.log(data);
                    if($parent.data('page') === 1 && data.html === '') {
                        $parent.find('.list_empty').show();
                    }
    				$parent.append(data.html);

    				if(data.is_end === true) {
    					//버튼 제거
                        $parent.siblings('.moreBtn').off().fadeOut(function(){
                            $(this).remove();
                        });
    				}else{
                        //버튼 노출
                        $parent.siblings('.moreBtn').show().one('click',function(){
                            addMore();
                        });
                    }
    				$parent.data('last_key', data.last_key);
                    $parent.data('page', data.page);
    				$parent.data('limit', data.limit);
    			},
    			error: function(e) {
    				console.log(e.responseText);
    			},
    			complete: function(e){
    				//로딩 제거
                    $.loading(parent,'stop');
    			}
    		});
    	};

        addMore();
    };
})(jQuery);



// hereDoc
function hereDoc(f) {
    return f.toString().
    replace(/^[^\/]+\/\*!?/, '').
    replace(/\*\/[^\/]+$/, '');
}

// 모달
(function($) {

    //에러 공통 표기
    $.ajax_error_info = function(request, status, error) {
        txt = "request : \n\n" + request + "\n\n";
        txt += "status : \n\n" + status + "\n\n";
        txt += "error : \n\n" + error + "\n\n";
        alert(txt);
    };

    var modal_html = hereDoc(function() {
        /*!
        <div class="modal inmodal in" id="common-modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span></button>
                        <h4 class="modal-title">Default Modal</h4>
                    </div>
                    <div class="modal-body">
                        <p>One fine body…</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        */
    });

    // 열기
    $.fn.openModal = function(options) {

        if ($('#common-modal').length !== 0) {
            $('#common-modal, .modal-backdrop').remove();
        }

        $('body').append(modal_html);

        var default_options = {
            class: '',
            type: 'GET',
            url: '/',
            data: {},
            dataType: 'html',
            async: false,
            cache: false,
            processData: true,
            success: function(res) {
                $('#common-modal').html(res);
                $('#common-modal').modal('show');
            },
            error: function(res) {
                console.log(res.responseText);
                if (res.responseText) {
                    alert(res.responseText);
                    location.reload(true);
                }
            }
        };

        var modal_option = {
            show: true,
            backdrop: true,
            keyboard: true
        };

        if (options.backdrop !== undefined) {
            modal_option.backdrop = options.backdrop;
        }else if (options.keyboard !== undefined) {
            modal_option.keyboard = options.keyboard;
        }

        options.success = function(res) {
            $('#common-modal').html(res);
            $('#common-modal').modal(modal_option);
        };

        options = $.extend(default_options, options);

        $('#common-modal').attr('class', 'modal inmodal fade').addClass(options.class);
        $.ajax(options);
    };

    //모달 닫기 개선
    $(document).on('hidden.bs.modal', '#common-modal', function (e) {
        $('#common-modal').empty();
    });

    // 모달내 페이지네이션
    $(document).on('click', '#common-modal .pagination li a.ajax-mode', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'GET',
            url: $(this).attr('href') + $(this).data('suffix'),
            dataType: 'html',
            async: false,
            cache: false,
            processData: true,
            success: function(res) {
                $('#common-modal').html(res);
            },
            error: function(res) {
                console.log(res.responseText);
                if (res.responseText) {
                    alert(res.responseText);
                    location.reload(true);
                }
            }
        });
    });

    // 모달내 검색기능
    $(document).on('click', '#search-btn-modal', function(e) {
        e.preventDefault();
        var frmId = $(this).parents("form").attr("id");
        var action = $("#" + frmId).attr("action");

        $.ajax({
            type: 'GET',
            url: action,
            data: $("#" + frmId).serialize(),
            dataType: 'html',
            async: false,
            cache: false,
            processData: true,
            success: function(res) {
                $('#common-modal').html(res);
            },
            error: function(res) {
                console.log(res.responseText);
                if (res.responseText) {
                    alert(res.responseText);
                    location.reload(true);
                }
            }
        });
    });



})(jQuery);

    $(document).on('click', '.call_salesman', function(e) {
        //$('.salesman_popup .tel_msg').html('담당영업사원 : '+$(this).data('name'));
        $('.opacity_popup').show();
        $('.salesman_popup .c_phone').text($(this).data('phone'));
        $('.salesman_popup .m_c_phone').attr('href', 'tel:'+$(this).data('phone'));
        $('.salesman_popup').show();
        $('html').addClass('html_popup');
    });

    $(document).on('click', '.popup_close', function(e) {
        $('.opacity_popup').hide();
        $(this).parents('.popupsm_opacity').hide();
        $('.salesman_popup').hide();
        $('html').removeClass('html_popup');
    });
