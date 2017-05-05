$(document).ready(function() {
	var questionType = null;
	var questionDifficulty = null;
	var answerNum = null;
	var numOfAnswer = [];
	var isSequanceAnswer = true;

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

	$(function () {
		$('.sev_check').click(function(e) {
			$('.sev_check').not(this).prop('checked', false);
			answerNum = $('.sev_check:checked').val();
		});
	});


	$('#form').validator().on('submit', function (e) {
		if (e.isDefaultPrevented()) {
			alert("XX");
		} else {
			addContent();
			checkAnswerSequance();
         if(questionType != null && questionDifficulty != null && answerNum != null && checkEmptyField(answerNum) && isSequanceAnswer) {
      	   $.ajax({
             type: 'POST',
             data: createObject(),
             url: '/question'
           });
         } else {alert("Invalid Form.");}
      }
     });

	function checkEmptyField(answerNum) {
		const answer = "answer";
		var findAnswerNum = answer + answerNum;
		var value = $.trim($("#" + findAnswerNum).val());

		if (value.length > 0) {
			//console.log(value);
			return true;
		} else {
			//console.log(value);
			return false;
		}
	}

	function createObject() {
		var quiz_question = {
			question: $.trim($("#question").val()),
			subject: questionType,
			type: "Single",
			difficulty: questionDifficulty,
			answer: answerNum,
			choices: numOfAnswer
		};
		return quiz_question;
	}

	function addContent() {
		var num = ["answerZero", "answerOne", "answerTwo", "answerThree", "answerFour", "answerFive"];
		for(var i = 0; i < num.length; i++) {
			var answerNum = num[i];
			var value = $.trim($("#" + answerNum).val());
			if (value.length > 0) {
				numOfAnswer.push(value);
			}
		}
		return;
	}

	function checkAnswerSequance() {
		var num = ["answerZero", "answerOne", "answerTwo", "answerThree", "answerFour", "answerFive"];
		for(var i = 0; i < numOfAnswer.length; i ++) {
			var answerNum = num[i];
			var value = $.trim($("#" + answerNum).val());
			if (value.length <= 0) {
				isSequanceAnswer = false;
			}
		}
		return;
	}
});