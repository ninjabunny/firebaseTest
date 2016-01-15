  // Prompt the user for a name to use.
  var currentStatus = "★ online";


  // Get a reference to the presence data in Firebase.
  var userListRef = new Firebase("https://kodenames.firebaseio.com/");
  userListRef.authAnonymously(function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
    }
  });
  var name = userListRef.getAuth().uid;
  // Generate a reference to a new location for my user with push.
  var myUserRef = userListRef.push();

  // Get a reference to my own presence status.
  var connectedRef = new Firebase("https://kodenames.firebaseio.com/.info/connected");

  connectedRef.on("value", function(isOnline) {
    if (isOnline.val()) {
      // If we lose our internet connection, we want ourselves removed from the list.
      myUserRef.onDisconnect().remove();

      // Set our initial online status.
      setUserStatus("★ online");
    }
    else {

      // We need to catch anytime we are marked as offline and then set the correct status. We
      // could be marked as offline 1) on page load or 2) when we lose our internet connection
      // temporarily.
      setUserStatus(currentStatus);
    }
  });

  // A helper function to let us set our own state.
  function setUserStatus(status) {
    // Set our status in the list of online users.
    currentStatus = status;
    myUserRef.set({ name: name, status: status });
  }

  function getMessageId(snapshot) {
    return snapshot.key().replace(/[^a-z0-9\-\_]/gi,'');
  }

  // Update our GUI to show someone"s online status.
  userListRef.on("child_added", function(snapshot) {
    var user = snapshot.val();
    $('#flexy').append("<li id='"+ user.name +"'class='flex-item' onclick='fire()'></li>");
  });

  // Update our GUI to remove the status of a user who has left.
  userListRef.on("child_removed", function(snapshot) {
    var user = snapshot.val();
    // $('.' + user.name).children("#" + getMessageId(snapshot))
    //   .remove();
    $('#' + user.name).remove();
  });

  // Update our GUI to change a user"s status.
  userListRef.on("child_changed", function(snapshot) {
    var user = snapshot.val();
    $('#' + user.name).remove();
  });


  function changeColor(selector, colors, time) {
    $(selector).css("background-color", colors[0]);
    setTimeout(function () {
      $(selector).css("background-color", colors[1]);
    }, time);
  };
  $(window).load(function () {
      changeColor("#" + name, ["green", "white"], 3000);
  });

  function fire(){
      changeColor("#" + name, ["green", "white"], 3000);
  }

