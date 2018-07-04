ig.module(
	'impact.main'
)
.requires(
	'impact.game',
	'impact.entity',
	'impact.collision-map',
	'impact.background-map',
	'impact.font',
    'game.levels.space'
    //'impact.debug.debug'
)
.defines(function() {

    "user strict";

    // Title Screen
   var StartScreen = ig.Game.extend({
        font: new ig.Font('media/retro-font.png'),
        background: new ig.Image('media/screen-bg.png'),
        init: function () {
            ig.input.bind(ig.KEY.ENTER, 'start');
            ig.input.bind(ig.KEY.A, 'left');
            ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
            ig.input.bind(ig.KEY.D, 'right');
            ig.score = 0;
            ig.highScore = 0;
            ig.jewel = 0;
            ig.totaljewels = 0;
            ig.playCount = 0;
        },
        update: function () {
            if (ig.input.pressed('start')) {
                ig.system.setGame(Tutorial1);
            }
            this.parent();
        },
        draw: function () {
            this.parent();
            this.background.draw(0, 0);
            this.font.draw('Press Enter to Start', ig.system.width / 2, 675, ig.Font.ALIGN.CENTER);
        }
    });

      var Tutorial1 = ig.Game.extend({
            font: new ig.Font('media/retro-font.png'),
            background: new ig.Image('media/tutorials/UI_Tutorial01.png'),
            update: function () {
                if (ig.input.pressed('start')) {
                    ig.system.setGame(LevelSpace);
                }
                if(ig.input.pressed('right')){
                    ig.system.setGame(Tutorial2)
                }
                this.parent();
            },
            draw: function () {
                this.parent();
                this.background.draw(0, 0);
            }
        });

       var Tutorial2 = ig.Game.extend({
            font: new ig.Font('media/retro-font.png'),
            background: new ig.Image('media/tutorials/UI_Tutorial02.png'),
            update: function () {
                if (ig.input.pressed('start')) {
                    ig.system.setGame(LevelSpace);
                }
                if(ig.input.pressed('left')){
                    ig.system.setGame(Tutorial1)
                }
                if(ig.input.pressed('right')){
                    ig.system.setGame(Tutorial3);
                }
                this.parent();
            },
            draw: function () {
                this.parent();
                this.background.draw(0, 0);
            }
        });

       var Tutorial3 = ig.Game.extend({
            font: new ig.Font('media/retro-font.png'),
            background: new ig.Image('media/tutorials/UI_Tutorial03.png'),
            update: function () {
                if (ig.input.pressed('start')) {
                    ig.system.setGame(LevelSpace);
                }
                if(ig.input.pressed('left')){
                    ig.system.setGame(Tutorial2)
                }
                if(ig.input.pressed('right')){
                    ig.system.setGame(LevelSpace);
                }
                this.parent();
            },
            draw: function () {
                this.parent();
                this.background.draw(0, 0);
            }
        });


    ig.main('#canvas', StartScreen, 60, 1150, 750, 1 );
});