$(document).ready(function() {
	var questionType = null;
	var questionDifficulty = null;
	var answer = [];

	$('.btn-default').click(function() {
		$(this).addClass('selected');
		$('.btn-default').not(this).removeClass('selected');
		isQuestionTypeChecked = true;
		questionType = $(this).attr("value")
	});

	$('.colorBtn').click(function() {
		$(this).addClass('colorBtnSelected');
		$('.colorBtn').not(this).removeClass('colorBtnSelected');
		isQuestionDifficultyChecked = true;
		questionDifficulty = $(this).attr("value")
	});

	$('#form').validator().on('submit', function (e) {
		if (e.isDefaultPrevented()) {

		} else {
         if(questionType != null && questionDifficulty != null) {
             $.ajax({
                   type: 'POST',
                   data: createObject(),
                   url: '/question'
                });

         } else {alert("XXXX");}
      }
     });

	 function createObject() {
	 	var getSplitAnswer = splitAnswer();
		var quiz_question = {
			question: $.trim($("#question").val()),
			subject: questionType,
			difficulty: questionDifficulty,
			type: "Open",
			answer: getSplitAnswer
		};
		return quiz_question;
	}

	function splitAnswer() {
		var q = $.trim($("#openquestion").val());
		var arr = new Array();
		arr = q.split(",");
		return arr;
	}
});