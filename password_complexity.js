$(document).ready(function(){

    var $settings = {
        password_length : 8,
        lower : true,
        upper : true,
        number : true,
        symbols : false,
        excess : true,
        lower_score : 2,
        upper_score : 3,
        number_score : 4,
        symbols_score : 5,
        excess_score : 1,
        base_score : 0,
        total_score : 0,
        weak : 50, //50 - 74 
        average : 75, //75 - 99
        strong : 100 //100 up
    };

    var $gauge = {
        weak : {
            label : 'Weak',
            progress_color : 'bg-danger'
        },
        average : {
            label : 'Average',
            progress_color : 'bg-warning',
        },
        strong : {
            label : 'Strong',
            progress_color : 'bg-success'
        }
    };

    $('span.toggle-password').on({
        'mouseenter' : function() {
            $(this).parent().find('input').attr("type", "text");
            $(".field-icon")
                .removeClass('fa-eye')
                .addClass('fa-eye-slash');

        },
        'mouseleave' : function() {
            $(this).parent().find('input').attr("type", "password");
            $(".field-icon")
                .removeClass('fa-eye-slash')
                .addClass('fa-eye');
        }	
    });
    
	$("input[type='password'].password-complexity").on('keyup', function() {
        var $this = $(this);
        var password_value = $this.val();
        
        if(password_value.length == 0) {
            $('.progress').remove();
            $settings.total_score = 0;
        } else {
            if(!$('.progress').length) {
                $this.parent().find('span').after('<div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="1000" style="width: 0%"></div></div>');
            }
        }        
        validatePasswordComplexity($this, password_value, $settings.password_length);
    });

    function validatePasswordComplexity($this, password_value, password_length) {
        var $num = {
            lower : 0,
            upper : 0,
            number : 0,
            symbols : 0,
            excess : 0
        }; 
        $settings.base_score = 30;

        for(i = 0; i < password_value.length; i++) {
            ($settings.lower && password_value[i].match(/[a-z]/g)) ? $num.lower+=$settings.lower_score : 0;
            ($settings.upper && password_value[i].match(/[A-Z]/g)) ? $num.upper+=$settings.upper_score : 0;
            ($settings.number && password_value[i].match(/[0-9]/g)) ? $num.number+=$settings.number_score : 0;
            ($settings.symbols && password_value[i].match(/[~!@#$%^&*()_+{}]/g)) ? $num.symbols+=$settings.symbols_score : 0;
        }
        $num.excess = ((password_value.length - password_length) >= 1) ? (password_value.length - password_length) + $settings.excess_score : 0;

        $_total = 0;
        $.each($num, function(k, v) {
           $_total += v;
        });
        $settings.total_score = $settings.base_score + $_total; 
        updateProgressBar($settings.total_score);
    }

    function updateProgressBar(score) {
        console.log(score);
        $(".progress-bar").css('width', score+'%');

        if(score <= $settings.weak) {
            $(".progress-bar").html($gauge.weak.label);

            $(".progress-bar").addClass($gauge.weak.progress_color);
            $(".progress-bar").removeClass($gauge.average.progress_color);
            $(".progress-bar").removeClass($gauge.strong.progress_color);
        } else if(score > $settings.weak & score <= $settings.average) {
            $(".progress-bar").html($gauge.average.label);

            $(".progress-bar").removeClass($gauge.weak.progress_color);
            $(".progress-bar").addClass($gauge.average.progress_color);
            $(".progress-bar").removeClass($gauge.strong.progress_color);
        } else if(score > $settings.average) {
            $(".progress-bar").html($gauge.strong.label);

            $(".progress-bar").removeClass($gauge.weak.progress_color);
            $(".progress-bar").removeClass($gauge.average.progress_color);
            $(".progress-bar").addClass($gauge.strong.progress_color);
        }
    }
});