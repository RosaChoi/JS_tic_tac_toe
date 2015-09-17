(function() { // Nice use of closure here
  var ticTacToe = {
    winningCombinations: [
      [0,1,2],[3,4,5],[6,7,8],[0,4,8],
      [0,3,6],[1,4,7],[2,5,8],[2,4,6]
    ],
    oMoves: [],
    xMoves: [],
    counter: 1,
    winCounter: 0, // There's no need for this to be a property on the ticTacToe object. It can be a local variable in the checkForWin function
    turnText: {
      x: "it's x's turn", // Might be better to have this in the html, and switch displays by toggling a css class. I prefer to keep View level things outside of the Controller.
      o: "it's o's turn"
    },
    init: function() {
      this.cacheDome(); // Should be cacheDOM (nitpick, I know :D)
      this.bindEvents();
    },
    cacheDome: function() {
      this.$el = $('.wrapper'); // No need for this to be a property on this, it's not used outside this function
      this.$grid = this.$el.find('#grid .row'); // Same here
      this.$squares = this.$grid.find('.square');
      this.$reset = this.$el.find('#reset');
      this.$message = this.$el.find('#message');
      this.$score = this.$el.find('#scoreBoard');
      this.$time = this.$el.find('#remainingSecs strong');
    },
    bindEvents: function() {
      this.$squares.on('mouseover', this.hoverSquare); // Not sure where this function is defined. Couldn't find it.
      this.$squares.on('click', this.addSymbol.bind(this)); // this.makeMove or this.takeTurn might be a better function name. addSymbol does a lot more logic than simply adding a symbol
      // 5seconds countdown is working in progress
      // this.$squares.on('click', this.setTime.bind(this));
      this.$reset.on('click', this.resetBoard.bind(this));
    },
    addSymbol: function(event) {
      if(!$(event.target).hasClass('fa')) { // No idea what this class means. It's really weird that you're using CSS classes to maintain state.
        if(this.counter % 2 === 0) { // The if and else branches are very similar. You should look into abstracting that out so you're not repeating yourself as much. This suggestion is more useful in bigger projects.
          this.oMoves.push(parseInt(event.target.getAttribute('data-num')));
            $(event.target)
              .addClass('fa fa-circle-o') // I would store state information like this in a this.currentGameState array or something. Putting it in the DOM is bad practice, and in some cases simply reading a value in the DOM can cause a re-render of the page to happen, which is a big blow to performance
              .removeClass('has-hover')
              .addClass('o');
          this.$message.text(this.turnText.x).css('color', '#EEDA76');
          this.counter ++ ;
          this.checkForWin(this.oMoves, 'O'); // Not sure why you're passing in the second parameter here. It can be inferred in checkForWin using this.counter
        } else {
          this.xMoves.push(parseInt(event.target.getAttribute('data-num')));
          $(event.target)
            .addClass('fa fa-times')
            .removeClass('has-hover')
            .addClass('x');
          this.$message.text(this.turnText.o).css('color', '#4F83AC');
          this.counter ++;
          this.checkForWin(this.xMoves, 'X');
        }
        // if the counter is greater than or equal to 10, the game is a draw
        if (this.counter >= 10) {
          this.$score
            .fadeToggle(1000)
            .text("Game over, it's a draw.");
          this.$reset.text('play again!');
        }
      }
    },
    checkForWin: function(movesArray, name) {
      // loop over the first array of winningCombinations
      for(var i = 0; i < this.winningCombinations.length; i ++) { // Arrays have a forEach method now :) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
        // reset the winCounter each time
        this.winCounter = 0; // Could just be a local variable
        // loop over each individual array
        for(var j = 0; j < this.winningCombinations[i].length; j ++) {
          // if the number in winningCombinations array is  === a number in movesArray, add to winCounter
          if(movesArray.indexOf(this.winningCombinations[i][j]) !== -1) {
            this.winCounter ++;
          }
          // if winCounter === 3 that means all 3 move are winning combos and game is over
          if(this.winCounter === 3) {
            this.$score
              .fadeToggle(1000)
              .text("Game over, " + name + " wins!");
            this.$reset.text('play again!');
          }
        }
      }
    },
    setTime: function() {
      //working in progress
      var targetDate = new Date(),
          seconds = targetDate.getSeconds(),
          _this = this.$time;
      // setInterval(function() {
      //   var currentSec = new Date().getSeconds(),
      //       seconds_left = 5 - (currentSec - seconds);
      //   _this.text(seconds_left);
      // }, 1000);

    },
    resetBoard: function() {
      for(var i = this.$squares.length - 1; i >=0; i --) {
        $(this.$squares[i]).removeClass('x fa fa-times').removeClass('o fa fa-circle-o');
      }
      this.counter = 1;
      this.oMoves = [];
      this.xMoves = [];
      this.winCounter = 0;
      this.$message.text(this.turnText.x).css('color', '#EEDA76');
      if (this.$reset.text() === 'quit'){ // What does quit do differently? It seems like the reset button text is irrelevant
        this.$reset.text('play again!');
      } else {
        this.$reset.text('quit');
      }
    }
  };
  ticTacToe.init();
})();

/* 
In summary,
It's pretty readable, but it seems largely focused on using the DOM and jQuery to contain the state. That's not really a great practice to follow. Granted, it is a very simple application, and so it's okay to do so here, but for larger codebases, you would want to use a framework of some kind to hold state data. Combining the DOM and state data can lead to confusion and bugs in larger projects.
The meaning behind some of the CSS classes wasn't obvious. Namely, 'fa', 'fa-times', and 'fa-circle-o'. I'm not sure 
Also, I would recommend using SCSS to write CSS, and then compile to CSS. SCSS is easier to maintain than raw CSS.
You have a spec file, but no actual tests, as far as I can see. That's unfortunate :(. A simple application like this is begging to be tested.
Completely unnecessary, but you could throw in underscore.js here for some cleanup. It would make your checkForWin code simpler if you just used _.union to see if the win condition was satisfied.
*/
