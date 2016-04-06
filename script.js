var myFirebaseRef = new Firebase("https://s60912frank.firebaseio.com/");
var imageToUpload;
$(document).ready(
  function(){
    myFirebaseRef.child("comments").once("value",
    function(snapshot){
      $("#commemts").find('tr').remove();
      snapshot.forEach(
        function(comment){
          addDataToTable(comment);
        }
      );
    });

    myFirebaseRef.child("comments").on("child_added",
    function(snapshot){
        addDataToTable(snapshot);
    });


    $('#submit').click(
      function(){
        sendData();
        $('#message').val("");
        $('#submit').attr("disabled", true);
    });

    $('#inputfield').keyup(
      function(){
        var authorLength = $('#author').val().length;
        var messagelength = $('#message').val().length;
        if(authorLength > 0 && messagelength > 0){
          $('#submit').attr("disabled", false);
        }
        else{
          $('#submit').attr("disabled", true);
        }
      }
    );

    $('#inputfield').keypress(
      function(event){
        if(event.which === 13){
          if(!$('#submit').prop("disabled")){
            sendData();
            $('#message').val("");
            $('#submit').attr("disabled", true);
          }
        }
      }
    );

    $('#create').click(
      function(){
        myFirebaseRef.child('images').push().set(
          {
            cid: "0",
            image: "0"
          }
        )
      }
    );



  });

  var getTimeString = function(){
    var current = new Date();
    var timeString = current.getFullYear() + "/" +
                     formatZero((current.getMonth()+1)) + "/" +
                     formatZero(current.getDate()) + " " +
                     formatZero(current.getHours()) + ":" +
                     formatZero(current.getMinutes());
    return timeString;
  }

  var formatZero = function(num){
    if(num < 10){
      return "0" + num;
    }
    else{
      return num;
    }
  }

  var addDataToTable = function(data){
    var newTableRow = $('<tr>').hide();
    newTableRow.append($('<td>').text(data.val().message));
    newTableRow.append($('<td>').text(data.val().author));
    newTableRow.append($('<td>').text(data.val().time));
    $('#commemts').prepend(newTableRow);
    newTableRow.fadeIn(300);
    var image = data.val().image;
    if(image != null){
      //console.log(image);
      var canvas = document.getElementById("imageCanvas");
      var context = canvas.getContext("2d");
      //context.clearRect(0, 0, canvas.width, canvas.height);
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = image;
      //img.src = image;
      img.onload = function(){
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
      };
    }
  }

  var openFile = function(event) {
    var canvas = document.getElementById("imageCanvas");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function(e){
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = reader.result;
      img.onload = function(){
        var ratio = img.width / img.height;
        img.height = 300;
        img.width = img.height * ratio;
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        imageToUpload = canvas.toDataURL('image/png');
        console.log(imageToUpload);
      }
    };
    reader.readAsDataURL(input.files[0]);
  };

  var sendData = function(){
    myFirebaseRef.child('comments').push().set(
      {
        author: $('#author').val(),
        message: $('#message').val(),
        time: getTimeString(),
        image: checkImage()
      }
    );
  }

  var checkImage = function(){
    if(imageToUpload != null){
      return imageToUpload;
    }
    else{
      return null;
    }
  }
