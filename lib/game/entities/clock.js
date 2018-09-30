ig.module(
    'game.entities.clock'
)
    .requires(
    'impact.entity'
)
    .defines(function(){

        EntityClock = ig.Entity.extend({
            size: {x:32, y:32},
            offset: {x:0, y:0},
            animSheet: new ig.AnimationSheet( 'media/clock.png', 32, 31 ),
            type: ig.Entity.TYPE.B,
            checkAgainst: ig.Entity.TYPE.B,
            cellPickup: new ig.Sound('media/sounds/clock.*'),

            init: function( x, y, settings ) {
                this.parent( x, y, settings );
                this.addAnim( 'idle', 0.15, [0,1,2,3] );
            },

            update: function() {
                this.parent();
                if( this.pos.y - ig.game.screen.y < -32 ) {
                    this.kill();
                }
            },

            pickup: function() {
                ig.game.speed -= 100;
                this.cellPickup.volume = 0.2;
                this.cellPickup.play();
                this.kill();
            },

		    // Kill clocks or jewels this entity touches
            check: function( other ) {
                other.kill();
            }
        });

    });

