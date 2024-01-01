ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)

.defines(function(){

EntityPlayer = ig.Entity.extend({
		size: {x:24, y:50},
        offset: {x: 20, y: 10},
		checkAgainst: ig.Entity.TYPE.B,
		animSheet: new ig.AnimationSheet( 'media/ClydeCycles.png', 64, 64 ),
		maxVel: {x: 300, y: 600},
		friction: {x: 1800, y:0},
		flip: false,
		speed: 700,
		jump: 475,
        airJump: false,
        land: new ig.Sound('media/sounds/land.*'),
        jumpSound: new ig.Sound('media/sounds/jump.*'),
        propelSound: new ig.Sound('media/sounds/propel.*'),
        walkBool : false,

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			// Animations
			this.addAnim( 'idle', .2, [6] );
			this.addAnim( 'move', .1, [1,2,3,4,5,6,7] );
            this.addAnim( 'fall', .09, [8,9,10,11,12,13,14,15]);
            this.addAnim( 'jump', .09, [17,18,18,18,19,19,19,20]);
            this.addAnim( 'doublejump', .09, [22,22,23,24,25,26,27]);
		},

		update: function() {

            // jump
            if( this.standing && ig.input.pressed('jump'))
            {
                this.vel.y = -this.jump;
                this.jumpSound.volume = 0.3;
                this.jumpSound.play();
            }

            // Air jump
			if( !this.standing && ig.input.pressed('jump') && this.airJump == true){
                this.vel.y = -this.jump * 2;
                this.airJump = false;
                this.propelSound.play();
            }

            // Can air jump
            if(this.standing)
            {
                this.airJump = true;
            }

            // Move the player left
            if( ig.input.state('left') )
			{
				this.accel.x = -this.speed;
                this.flip = true;
            }
            // Move the player right
			else if( ig.input.state('right') )
			{
				this.accel.x = this.speed;
                this.flip = false;
            }
            // The player is idle
			else
			{
				this.accel.x = 0;
            }

            this.animationController();
            this.parent();

        },

        animationController: function(){
            // Based off where the player is doing,
            // Play the animations

            if(this.vel.y < 0){
                this.currentAnim = this.anims.jump;

                if(this.vel.y <= 325 && this.airJump == false){
                    this.currentAnim = this.anims.doublejump;
                }
            }
            else if(this.vel.y > 0) {
                this.currentAnim = this.anims.fall;
            }
            else if(this.vel.x !=0){
                this.currentAnim = this.anims.move;
            }
            else{
                this.currentAnim = this.anims.idle;
            }

            this.currentAnim.flip.x = this.flip;
        },

		handleMovementTrace: function( res ) {
            if( res.collision.y && this.vel.y > 64 ) {
               this.land.volume = 0.1;
            	this.land.play();
            }

			this.parent(res);
		},

		check: function( other ) {
			other.pickup();
		}
	});

});
