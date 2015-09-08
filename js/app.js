(function() {
  var ticTacToe = {
    winningCombinations: [
      [0,1,2],[3,4,5],[6,7,8],[0,4,8],
      [0,3,6],[1,4,7],[2,5,8],[2,4,6]
    ],
    oMoves: [],
    xMoves: [],
    counter: 1,
    winCounter: 0,
    turnText: {
      x: "it's x's turn",
      o: "it's o's turn"
    },
    init: function() {
      this.cacheDome();
      this.bindEvents();
    },
    cacheDome: function() {
      this.$el = $('.wrapper');
      this.$grid = this.$el.find('#grid .row');
      this.$squares = this.$grid.find('.square');
      this.$reset = this.$el.find('#reset');
      this.$message = this.$el.find('#message');
      this.$score = this.$el.find('#scoreBoard');
      this.$time = this.$el.find('#remainingSecs strong');
    },
    bindEvents: function() {
      this.$squares.on('mouseover', this.hoverSquare);
      this.$squares.on('click', this.addSymbol.bind(this));
      // 5seconds countdown is working in progress
      // this.$squares.on('click', this.setTime.bind(this));
      this.$reset.on('click', this.resetBoard.bind(this));
    },
    addSymbol: function(event) {
      if(!$(event.target).hasClass('fa')) {
        if(this.counter % 2 === 0) {
          this.oMoves.push(parseInt(event.target.getAttribute('data-num')));
            $(event.target)
              .addClass('fa fa-circle-o')
              .removeClass('has-hover')
              .addClass('o');
          this.$message.text(this.turnText.x).css('color', '#EEDA76');
          this.counter ++ ;
          this.checkForWin(this.oMoves, 'O');
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
      for(var i = 0; i < this.winningCombinations.length; i ++) {
        // reset the winCounter each time
        this.winCounter = 0;
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
      if (this.$reset.text() === 'quit'){
        this.$reset.text('play again!');
      } else {
        this.$reset.text('quit');
      }
    }
  };
  ticTacToe.init();
})();
