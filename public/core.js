var regexQuantity = '^[1-9][0-9]*$';
var regexDouble = '^[0-9]*\.[0-9]*$';

var scotchFood = angular.module('scotchFood', []);
angular.module("myApp", ["ngTable"]);
var totalBill=0;
$(document).ready(function(){
	$("#cart").click(function(){
		if($('#selectFood').val() === null){
		  $(".alert").removeClass("hide");  
		  $(".alert").removeClass("alert-success");  
		  $(".alert").addClass("alert-danger");  
		  $(".alert").html("Please select food item.");	  
		  setTimeout(message, 2000);
		  return false;
			}
			
			if(!$('#quantity').val().match(regexQuantity)){
		  $(".alert").removeClass("hide");	    
		  $(".alert").removeClass("alert-success");  
		  $(".alert").addClass("alert-danger");
		  $(".alert").html("Invalid quantity");
		  setTimeout(message, 2000);
		  return false;
			}
			
		$('#cartTable tr:last').after('<tr><td>'+$('#selectFood option:selected').text()+'</td><td>'+$('#selectFood').val()+'</td><td>'+$('#quantity').val()+'</td><td class="cost">'+parseFloat($('#selectFood').val())*parseInt($('#quantity').val())+'</td><td><button class="btn btn-danger btn-xs" onclick="removeRow(this);"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button></td></tr>');
		totalBill += parseFloat($('#selectFood').val())*parseInt($('#quantity').val());
		$("#bill").trigger("click");
	});
	
	$("#bill").click(function(){
		$(".bill-amount").removeClass('hide');
		var billAmt = totalBill + totalBill*0.075;
		$("#billPrice").html("Bill : $" + billAmt + " including taxes.");
	});
	

});
 
 function message(){
	  $(".alert").addClass("hide");
	}
	
function removeRow(row){
	totalBill -= parseFloat($(row.closest('tr')).find('.cost').html());
	row.closest('tr').remove();	
	$("#bill").trigger("click");
}
function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all foods and show them
    $http.get('/api/foods')
        .success(function(data) {
            $scope.foods = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createFood = function() {
		  if($.trim($('#foodItem').val()) == ""){
		  $(".alert").removeClass("hide");	  
		  $(".alert").removeClass("alert-success");  
		  $(".alert").addClass("alert-danger");    
		  $(".alert").html("Pleas enter food item.");
		  setTimeout(message, 2000);
		  return false;
			}
			
			if(!$('#price').val().match(regexDouble)){
		  $(".alert").removeClass("hide");  
		  $(".alert").removeClass("alert-success");  
		  $(".alert").addClass("alert-danger");  
		  $(".alert").html("Invalid price");	  
		  setTimeout(message, 2000);
		  return false;
			}
			
        $http.post('/api/foods', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready
										// to enter another
                $scope.foods = data;
				$(".alert").addClass("alert-success");  
			  $(".alert").removeClass("alert-danger");
			  $(".alert").html("New food item added.");
$(".alert").removeClass("hide");  			  
				setTimeout(message, 2000);
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
	
	// when submitting the add form, send the text to the node API
    $scope.getTotal = function() {
        $http.get('/api/total')
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready
										// to enter another
                $scope.total = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteFood = function(id) {
        $http.delete('/api/foods/' + id)
            .success(function(data) {
                $scope.foods = data;
				  
			  $(".alert").addClass("alert-success");  
			  $(".alert").removeClass("alert-danger");
			  $(".alert").html("Food item removed.");	
$(".alert").removeClass("hide");  			  
				setTimeout(message, 2000);
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}