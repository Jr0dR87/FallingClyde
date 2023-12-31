ig.module(
    'game.levels.space'
)
    .requires(
    'impact.game',
    'impact.entity',
    'impact.collision-map',
    'impact.background-map',
    'impact.font',
    'game.entities.player',
    'game.entities.jewel',
    'game.entities.clock'
)

.defines(function(){

    // Back Drop
    FullsizeBackdrop = ig.Image.extend({
        resize: function () {
        },
        draw: function () {
            if (!this.loaded) {
                return;
            }
            ig.system.context.drawImage(this.data, 0, 0);
        }
    });

    LevelSpace = ig.Game.extend({
        clearColor: null,
        gravity: 1200,
        player: null,
        map: [],
        counter: 0,
        scoreMultiplier: 10,
        speed: 2,
        backdrop: new FullsizeBackdrop('media/background.png'),
        gameOverBackdrop: new FullsizeBackdrop('media/gameOver.png'),
        font: new ig.Font('media/retro-font.png'),
        gameOverSound: new ig.Sound('media/sounds/gameover.*'),
        music: new ig.Sound("media/sounds/music.*"),

        init: function () {

            if(ig.playCount === 0){
                this.music.volume = 0.4;
                this.music.loop = true;
                this.music.play();
            }

            ig.input.bind(ig.KEY.A, "left");
            ig.input.bind(ig.KEY.D, "right");
            ig.input.bind(ig.KEY.SPACE, "jump");
            ig.input.bind(ig.KEY.W, "jump")
            ig.input.bind(ig.KEY.LEFT_ARROW, "left");
            ig.input.bind(ig.KEY.RIGHT_ARROW, "right");
            ig.input.bind(ig.KEY.UP_ARROW, "jump");
            ig.input.bind(ig.KEY.ENTER, 'ok');

            // The first part of the map is always the same. Create an Array Map
            this.map = [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]

            // Now randomly generate the remaining rows
            for (var i = 8; i < 16; i++) {
                this.map[i] = this.getRow();
            }

            
            this.collisionMap = new ig.CollisionMap(64, this.map, {});
            this.backgroundMaps.push(new ig.BackgroundMap(64, this.map, 'media/platform_spritesheet.png'));

            // Place the Player in the middle of the screen when game starts
            this.player = this.spawnEntity(EntityPlayer, ig.system.width / 2 - 2, 64);

        },

        /**
         * Returns a random integer between min (inclusive) and max (inclusive)
         * Using Math.round() will give you a non-uniform distribution!
         * SRC: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
         */
        getRandomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        getRow: function() {
            // Math to make row
            var row = [];
            // x = number of rows in column
            for( var column = 0; column < 18; column++ ) {
                row[column] = Math.random() > .86 ? this.getRandomInt(1,3) : 0;
            }
            return row;
        },


        placeJewel: function() {
            // generate the Jewel in random spots
            var tile = (Math.random() * 18).ceil();
            for(var i = 12; i < 18; i++) {
                if (this.map[this.map.length - 1][tile] && !this.map[this.map.length - 2][tile]) {
                    var y = (this.map.length - 1) * 64;
                    var x = tile * 64 + 8;
                    this.spawnEntity(EntityJewel, x, y);
                    return;
                }
            }

        },

        placeClock: function() {
            // generate the Jewel in random spots
            var tile = (Math.random() * 18).ceil();
            if(this.map[this.map.length-1][tile] && !this.map[this.map.length-2][tile] && this.speed > 200) {
                var y = (this.map.length-1) * 64;
                var x = tile * 64 + 18;
                this.spawnEntity( EntityClock, x, y );
                return;
            }

        },


        speedController: function(){

            this.speed += ig.system.tick * (680/this.speed);

            this.screen.y += ig.system.tick * this.speed;

            // Control the score.
            ig.score += ig.system.tick * this.scoreMultiplier;

        },

        update: function() {

            if(this.gameOver){
                return true;
            }

            this.speedController();

            // Do we need a new row?
            if( this.screen.y > 180 ) {

                // Move screen and entities one tile up
                this.screen.y -= 64;
                for( var i =0; i < this.entities.length; i++ ) {
                    this.entities[i].pos.y -= 64;
                }

                // Delete first row, insert new
                this.map.shift();
                this.map.push(this.getRow());
            }

            // Place Jewel
            if( Math.random() > .87 ) {
                this.placeJewel();
            }

            if( Math.random() > .990 ) {
                this.placeClock();
            }

            this.parent();

            // check for gameover
            var playerPosition = this.player.pos.y - this.screen.y;
            if( playerPosition > ig.system.height + 64 || playerPosition < -192 ) {
                this.gameOver = true;
                this.gameOverSound.play();
            }
        },

        draw: function() {

            if(! this.gameOver){
                this.backdrop.draw();
            }

            if( this.gameOver ) {

                if(ig.score > ig.highScore){
                    ig.highScore = ig.score;
                }

                while(this.counter == 0){
                    ig.totaljewels += ig.jewel;
                    ig.playCount += 1;
                    this.counter++;
                }

                this.gameOverBackdrop.draw();

                this.font.draw('Press Enter to Restart Game!', ig.system.width / 2 - 365, 30, ig.Font.ALIGN.LEFT);

                this.font.draw('Programming: Jr0dR87', ig.system.width / 2 - 320, 100, ig.Font.ALIGN.LEFT);
				this.font.draw('Art: Steph', ig.system.width / 2 - 320, 160, ig.Font.ALIGN.LEFT);
				
                this.font.draw("Score: "+ ig.score.ceil().toString(), ig.system.width/2 - 50, 287, ig.Font.ALIGN.LEFT);
                this.font.draw("High Score: "+ ig.highScore.ceil().toString(), ig.system.width/2 - 50, 373, ig.Font.ALIGN.LEFT );
                this.font.draw("Jewels Collected: "+ ig.jewel.toString() , ig.system.width/2 - 50, 464, ig.Font.ALIGN.LEFT );
                this.font.draw("Total Jewels: "+ ig.totaljewels.toString(), ig.system.width/2 - 50, 540, ig.Font.ALIGN.LEFT );

                this.font.draw('Press Enter to Restart Game!', ig.system.width / 2 - 365, 700, ig.Font.ALIGN.LEFT);

                //reset the game
                if( ig.input.pressed('ok') ) {
                    ig.score = 0;
                    ig.jewel = 0;
                    ig.system.setGame(LevelSpace);
                }
            }
            else {
                this.parent();
                this.font.draw(ig.score.floor().toString(), ig.system.width -2, 2, ig.Font.ALIGN.RIGHT );
            }
        }
    });
});
