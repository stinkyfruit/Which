/**
 * Created by VaibhavNamburi on 11/01/2016.
 */
angular.module('which.controllers.which', ['which.factory', 'ionic.swoosh.cards'])

// .directive('noScroll', function($document) {

//   return {
//     restrict: 'A',
//     link: function($scope, $element, $attr) {
//       $document.on('touchmove', function(e) {
//         e.preventDefault();
//       });
//     }
//   }
// })
 
.controller('WhichCtrl', function($scope, $timeout, $state, $stateParams, WhichFactory) {
  $scope.reported = false;
  $scope.data = {
    username: window.localStorage.getItem('which.userToken'),
    activeSlide: 1,
    which: {
      id: $stateParams.id,
      question: $stateParams.question,
      thingA: $stateParams.thingA,
      thingB: $stateParams.thingB,
      imageURI: $stateParams.imageURI
    },
  };

 
  //This gets called when the user swipes, making a decision with the choice from the user
  $scope.decide = function(result) {
    $scope.reported = false;
    WhichFactory.choose(result, $scope.data.which.id, $scope.data.username).then(function(votingResult) {

      //Allows for state change, showing new view, second argument is the params being sent in to display results
      $state.go('app.result', {
        a: votingResult.votesForA,
        b: votingResult.votesForB,
        choice: result
      });
    });
  }

  
  //reportWhich is called when user presses report button, and will increment the report status
  $scope.reportWhich = function(){
    //pass in the which, the id of which
    if(!$scope.reported){
      WhichFactory.reporting($scope.data.which).then(function(){
        console.log('reported the which');
      });
      $scope.reported = true;
    } else {
      console.log('you already reported this');
    }
   
  }

  $scope.skipWhich = function(){
    WhichFactory.getNew().then(function(which) {

      if(which.length === 0){
        console.log('no more whiches');
        $state.go('app.tagView');
      } else {        
        var randomWhich = $scope.getRandomWhich(which);
        randomWhich.imageURI = WhichFactory.defaultImage(randomWhich.imageURI);
        $state.go('app.which', {
          id: randomWhich.id,
          question: randomWhich.question,
          thingA: randomWhich.thingA,
          thingB: randomWhich.thingB,
          imageURI: randomWhich.imageURI
          //tags: which.tags
        });
      }
    });    
  }



  $scope.$on('discard', function(event, element, card) {
    $scope.decide(card);
  });
  $scope.originalData = angular.copy($scope.data);

  $scope.$on('clear', function(event, state) {
      $scope.data = $scope.originalData;
  });
});



