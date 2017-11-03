$(document).ready(function() {
  //adding event listeners and attaching functions
  $(document).on("click", "#add-user", addUser);


  // functions

  function addUser(event) {
    event.preventDefault();
    var pass = $("#password-input").val();
    var passConfirm = $("#Confirm-password-input").val();
    if(pass === passConfirm){
      var User = {
        userName: $("#username-input").val(),
        password: pass,
        email: $("#email-input").val()
      };
      $.post("api/users", addUser);
    }
    console.log(User.password)
  };
})

$(function () 
 {
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

function getcitydetails(fqcn) {
 
  if (typeof fqcn == "undefined") fqcn = jQuery("#f_elem_city").val();
 
  cityfqcn = fqcn;
 
  if (cityfqcn) {
    $.getJSON(
      "http://gd.geobytes.com/GetCityDetails?callback=?&fqcn="+cityfqcn, function (data) {
        var city = {
          location: {
            lat: data.geobyteslatitude, 
            lng: data.geobyteslongitude
          },
          name: data.geobytescity
        }
        console.log(city);
    });
  }
}