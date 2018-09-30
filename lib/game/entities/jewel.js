ig.module(
	'game.entities.jewel'
)
.requires(
	'impact.entity'
)
.defines(function(){

	EntityJewel = ig.Entity.extend({
		size: {x:31, y:31},
		offset: {x:2, y:1},
		animSheet: new ig.AnimationSheet( 'media/pickup.png', 32, 32 ),
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.B,
		jewelPickup: new ig.Sound('media/sounds/cell.*'),
		
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'idle', 0.1, [0,1,2,3,0,0,0,0,0,0,0] );
		},
		
		update: function() {
			this.parent();
			if( this.pos.y - ig.game.screen.y < -32 ) {
				this.kill();
			}
		},
		
		pickup: function() {
			ig.score += 1000;
			ig.jewel += 1;
			this.jewelPickup.volume = 0.2;
			this.jewelPickup.play();
			this.kill();
		},

		// Kill clocks or jewels this entity touches
		check: function( other ) {
			other.kill();
		}
	});

});

