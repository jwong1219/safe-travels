//event listeners for add user and search city buttons
$(document).ready(function() {
  //adding event listeners and attaching functions

  //listener for search  
  $(document).on("click", "#search-btn", searchCity);

  //listener for create new account submit button
  $("#add-user").on("click", addUser);

  //listener for existing user login
  $("#login-submit").on("click", checkUser);
});

//initialize city to be an empty object
var city = {};

//autocomplete city search function
$(function () {
  $("#f_elem_city").autocomplete({
    source: function (request, response) {
     $.getJSON(
      "http://gd.geobytes.com/AutoCompleteCity?callback=?&q="+request.term,
      function (data) {
       response(data);
      }
     );
    },
    minLength: 3,
    select: function (event, ui) {
     var selectedObj = ui.item;
     $("#f_elem_city").val(selectedObj.value);
    getcitydetails(selectedObj.value);
     return false;
    },
    open: function () {
     $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
    },
    close: function () {
     $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
    }
   });
   $("#f_elem_city").autocomplete("option", "delay", 100);
});
//end autocomplete

function addUser(event) {
  //prevent page from refreshing by default
  event.preventDefault();

  console.log("add new user listener triggered!");

  //make sure to reset the erro-divs to their invisible state
  $(".error-div").removeClass("visible").addClass("invisible");

  //grab the new account details provided in the form
  var firstName = $("#first-name-input").val().trim();
  var lastName = $("#last-name-input").val().trim();
  var email = $("#email-input").val().trim();
  var userName = $("#new-username-input").val().trim();
  var password = $("#new-password-input").val();
  var passConfirm = $("#new-password-confirm-input").val();

  //create a new use object
  var newUser = {
    firstName : firstName,
    lastName : lastName,
    email : email,
    userName : userName,
    password : password,
    passConfirm : passConfirm
  };

  //send the POST request to the server
  $.post("api/users", newUser, function(data) {
    //if the insert is successful
    if ("outcome" in data) {
      //route to search page
      window.location.href = "/search";
    } //else if there is a mismatch in password entered
    else if ("passwordIssue" in data) {
      console.log("there is a mismatch in password");
      //show the password validation error
      $("#error-password-no-match").removeClass("invisible").addClass("visible");
    } //else either the email, username or password already exists in the db
    else if ("firstName" in data) {
      console.log("The account info provided already exists");
      console.log(data);
      //if the first name already exists in the db
      if (data.userName === userName) {
        //show the username validation error
        $("#error-username").removeClass("invisible").addClass("visible");
      } //else if the password already exists in the db
      else if (data.password === password) {
        //show the password validation error
        $("#error-password-not-available").removeClass("invisible").addClass("visible");
      } //else if the email already exists
      else if (data.email === email) {
        //show the email validation error
        $("#error-email").removeClass("invisible").addClass("visible");
      }
    } else {
      console.log("There is something wrong with the info. The account cannot be added");
    }
    
  });
}

function checkUser() {  
  //prevent page from refreshing by default
  event.preventDefault();

  console.log("checking for user in the database");

  //grab the username and password provided in the form
  var userNameInput = $("#input-user-name").val().trim();
  var passWordInput = $("#input-password").val();

  var existingUser = {
    userName : userNameInput,
    password : passWordInput
  };

  // send the get request to the server
  $.get("/api/users", existingUser, function(data) {
    console.log(data);
  });

}

//grab lat and lng from autocomplete
function searchCity() {
  console.log(city);
  $.post("/search", city, function(data) {
    console.log(data);
    initMap(city.location, data.hotelsData.results, data.crimeData)
  });
} //end searchCity

function getcitydetails(fqcn) {  
  if (typeof fqcn == "undefined") fqcn = jQuery("#f_elem_city").val();
  cityfqcn = fqcn;
  if (cityfqcn) {
    $.getJSON("http://gd.geobytes.com/GetCityDetails?callback=?&fqcn="+cityfqcn, function (data) {
      city = {
        location: {
          lat: data.geobyteslatitude, 
          lng: data.geobyteslongitude
        },
        name: data.geobytescity
      }
    });
  } //end if statement
} //end get city details