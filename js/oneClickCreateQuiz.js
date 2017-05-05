$(document).ready(function() {
	var numberOfMode = 0;
	const MAX_QUESTION_NUM = 10;
	const MIN_QUESTION_NUM = 5;
	var quizSubject = null;
	var quizStartTime = null;

    $('.sub').click(function() {
		$(this).addClass('selected');
		$('.sub').not(this).removeClass('selected');
		quizSubject = $(this).attr("value");	
	});


    function isValidNum() {
    	numberOfMode = parseInt($('#easy').val()) + parseInt($('#medium').val()) + parseInt($('#difficult').val());
    	if(numberOfMode == 0 || numberOfMode > MAX_QUESTION_NUM || numberOfMode <MIN_QUESTION_NUM) {
    		return false;
    	} else {
    		return true;
    	}
    }

    		var date_input=$('input[name="date"]'); //our date input has the name "date"
		var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
		date_input.datepicker({
			format: 'dd-mm-yyyy',
			container: container,
			todayHighlight: true,
			startDate: "+1d",
			autoclose: true,
		})

		$('#demo-input').clockpicker({
			autoclose: true
		});

	$('#form').validator().on('submit', function (e) {
		if (e.isDefaultPrevented()) {

		} else {
			if (isValidNum() && quizSubject != null) {

				 $.ajax({
                   type: 'POST',
                   data: createObject(),
                   url: '/createquickquiz'
               });
			} else {
				alert("Invalid form");
				//Invalid form
			}
      }
     })

	$('.clockpicker').clockpicker()
	.find('input').change(function(){
		quizStartTime = this.value;
	});

	function createObject() {
		var newQuiz = {
			subject: quizSubject,
			easy: parseInt($('#easy').val()),
			medium: parseInt($('#medium').val()),
			hard: parseInt($('#difficult').val()),
			random_question_sequence: $('#randomQuestion').prop('checked'),
			random_answer_sequence: $('#randomAnswer').prop('checked'),
			date: $('#date').val(),
			quizStartTime: quizStartTime,
			quizTimeLimit: $('#timelimit').val(),
			total_num_quiz: numberOfMode
		}
		return newQuiz;
	}
});