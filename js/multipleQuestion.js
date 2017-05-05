$(document).ready(function() {
	var questionType = null;
	var questionDifficulty = null;
	var answerNum = [];
	var numOfAnswer = [];
	var validAnswer = 0;
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
		$('.sev_check').click(function(){
			if($(this).prop('checked')){
				addValueToArray($(this).val());
			}else{
				removeValueFromArray($(this).val());
			} });
	});


	$('#form').validator().on('submit', function (e) {
		if (e.isDefaultPrevented()) {
		} else {
			for (var i = 0 ; i < answerNum.length ; i ++) {
				checkEmptyField(answerNum[i]);
			}
			addContent();
			checkAnswerSequance();
			if(questionType != null && questionDifficulty != null && answerNum.length >= 2 && validAnswer === answerNum.length && isSequanceAnswer) {

				 $.ajax({
                   type: 'POST',
                   data: createObject(),
                   url: '/question'
                });
			} else {alert("Invalid Form.");}
		}
	})

	function checkEmptyField(answerNum) {
		const answer = "answer";
		var findAnswerNum = answer + answerNum;
		var value = $.trim($("#" + findAnswerNum).val());

		if (value.length > 0) {
			validAnswer++;
		} else {}
	}

	function addValueToArray(value) {
		if (answerNum.indexOf(value) > - 1) {
			return;
		} else {
			answerNum.push(value);
			return;
		}
	}

	function removeValueFromArray(value) {
		var index = answerNum.indexOf(value);
		if ( index > - 1) {
			answerNum.splice(index, 1);
			return;
		} else {
			return;
		}
	}

    function createObject() {
		var quiz_question = {
			question: $.trim($("#question").val()),
			subject: questionType,
			difficulty: questionDifficulty,
			type: "Multiple",
			answer: answerNum,
			choices: numOfAnswer
		};
		return quiz_question;
	}

	function addContent() {
		var num = ["answerZero", "answerOne", "answerTwo", "answerThree", "answerFour", "answerFive"];
		for(var i = 0; i < num.length; i++) {
			var x = num[i];
			var value = $.trim($("#" + x).val());
			if (value.length > 0) {
				numOfAnswer.push(value);
			}
		}
		return;
	}

	function checkAnswerSequance() {
		var num = ["answerZero", "answerOne", "answerTwo", "answerThree", "answerFour", "answerFive"];
		console.log(numOfAnswer.length);
		for(var i = 0; i < numOfAnswer.length; i ++) {
			var x = num[i];
			var value = $.trim($("#" + x).val());
			if (value.length <= 0) {
				isSequanceAnswer = false;
				console.log(isSequanceAnswer);
			}
		}
		return;
	}
});