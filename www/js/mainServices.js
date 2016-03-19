/**
 * Created by 205 on 3/10/2016.
 */


angular.module('starter')

  .service("universalService", function ($rootScope, $state, notificationService, locationService) {
    var vm = this;


    $rootScope.ref = new Firebase("https://inzi-chat-app.firebaseio.com");

    vm.authData = $rootScope.ref.getAuth();
    authDataCallback(vm.authData);


    vm.authWithFacebook = function () {
      $rootScope.ref.authWithOAuthPopup("facebook", function (error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          vm.authData = authData;

          console.log("Authenticated successfully with payload:", authData);

          vm.currentRef = $rootScope.ref.child(authData.uid);

          vm.currentRef.update({
            name: authData.facebook.displayName,
            gender: authData.facebook.cachedUserProfile.gender,
            profileImageURL: authData.facebook.profileImageURL,
            expires: authData.expires,
            uid: authData.uid
          });

          vm.currentRef.on("value", function (snap) {
            data = snap.val();

            if (!data.joined) {
              vm.currentRef.update({
                joined: Firebase.ServerValue.TIMESTAMP
              });
            }
          });


          $state.go("dashboard");
          $rootScope.ref.onAuth(authDataCallback);
        }
      })
    };


    vm.authWithTwitter = function () {
      $rootScope.ref.authWithOAuthPopup("twitter", function (error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          vm.authData = authData;

          console.log("Authenticated successfully with payload:", authData);

          vm.currentRef = $rootScope.ref.child(authData.uid);

          vm.currentRef.update({
            name: authData.twitter.displayName,
            //gender: authData.facebook.cachedUserProfile.gender,
            profileImageURL: authData.twitter.profileImageURL,
            expires: authData.expires,
            uid: authData.uid
          });

          vm.currentRef.on("value", function (snap) {
            data = snap.val();

            if (!data.joined) {
              vm.currentRef.update({
                joined: Firebase.ServerValue.TIMESTAMP
              });
            }
          });


          $state.go("dashboard");
          $rootScope.ref.onAuth(authDataCallback);
        }
      })
    };


    vm.authWithGoogle = function () {
      $rootScope.ref.authWithOAuthPopup("google", function (error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          vm.authData = authData;

          console.log("Authenticated successfully with payload:", authData);

          vm.currentRef = $rootScope.ref.child(authData.uid);

          vm.currentRef.update({
            name: authData.google.displayName,
            // gender: authData.google.cachedUserProfile.gender,
            profileImageURL: authData.google.profileImageURL,
            expires: authData.expires,
            uid: authData.uid
          });

          vm.currentRef.on("value", function (snap) {
            data = snap.val();

            if (!data.joined) {
              vm.currentRef.update({
                joined: Firebase.ServerValue.TIMESTAMP
              });
            }
          });


          $state.go("dashboard");
          $rootScope.ref.onAuth(authDataCallback);
        }
      })
    };


    function authDataCallback(authData) {
      if (authData) {
        console.log("authChanged: User " + authData.uid + " is logged in with " + authData.provider);

        //make user online
        $rootScope.ref.child(authData.uid).child("loggedIn").onDisconnect().set(false);
        $rootScope.ref.child(authData.uid).child("loggedIn").set(true);

        locationService.startWatchingMyGeoPosition();
        $state.go("dashboard");

      } else {
        console.log("User is logged out");
        $state.go("home");
        notificationService.showAlert("please login again", "its look like your session is expired")

      }
    }

    vm.logout = function () {
      $rootScope.ref.offAuth(authDataCallback);
      $rootScope.ref.child(vm.authData.uid).update({loggedIn: false});
      $rootScope.ref.unauth();
      $state.go("home");
      notificationService.showAlert("Thankyou for using :-)", "hope you experienced well");
    }
  });







  //////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////
