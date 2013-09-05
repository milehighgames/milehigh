/*globals MileHigh,World */
/*jshint unused: false */
'use strict';

/*
  Main game mechanic.
  A turn happens each second.
*/

MileHigh.prototype.lastTurnTime = 0;

MileHigh.prototype.nextTurn = function (timestamp) {
  var secondsSinceLastTurn = Math.floor((timestamp - this.lastTurnTime) / 1000);

  if (!timestamp || this.lastTurnTime === 0 || secondsSinceLastTurn >= 1) {
    this.lastTurnTime = timestamp || 0;
    this.playTurn();
  }
};

MileHigh.prototype.playTurn = function () {
  /* GAME RULES CALLED FROM HERE */
  //console.log('running logic for this turn ', this.lastTurnTime);

  // There can be many states for the player.  Without implementing a damn
  // state machine, we need to use a basic switch statement to determine 
  // which rules to apply.
  switch (this.player.state) {
  case World.PlayerState.HORNY:
    // Check for proximity to travelers.  If near one, transition to flirting
    this.checkForFlirting();
    break;
  case World.PlayerState.FLIRTING:
    // When near any traveler and not currently paired, increase traveler heat
    // level
    this.checkForPairing();
    break;
  case World.PlayerState.PAIRED:
    // At the moment, there is no unpairing until they reach bathroom,
    // so not much to do in this state.
    break;
  case World.PlayerState.IN_BATHROOM:
    console.log('player is in a bathroom!');
    break;
  }

  this.gameStats.turns++;
};

/**
 * Check for proximity to traveler.  Simply transition to flirting mode if we
 * are near any - must be in nearby seat or isle?.
 */
MileHigh.prototype.checkForFlirting = function () {
  var near = this.world.getNearbyTravelers({breakOnMatch: true});

  if (near.length === 0) {  // revert to horny state if moved away
    this.player.state = World.PlayerState.HORNY;
    this.world.resetTravelerHeatLevels();
    console.log('player is horny');
    return;
  }

  if (near.length > 0) { // transition to flirting if near traveler
    this.player.state = World.PlayerState.FLIRTING;
    console.log('player is flirting');
  }
};

/**
 * Check heat levels on nearby travelers and see if we should become paired.
 */
MileHigh.prototype.checkForPairing = function () {
  var near = this.world.getNearbyTravelers();

  if (near.length === 0) {  // revert to horny state if moved away
    this.player.state = World.PlayerState.HORNY;
    console.log('player is horny');
  }
  // increment heat levels for nearby, and remove from those not or no longer nearby
  this.world.updateTravelerHeatLevels(near);

  this.pairedTravelers = this.world.travelersReadyToPair(near);
  if (this.world.travelersReadyToPair(near).length > 0) {
    this.player.state = World.PlayerState.PAIRED;
    console.log('player is paired with these traveler(s): ', near);

    //TODO: Once paired, the array of pairings needs to be saved so they can be
    //    dragged behind the player as they move to the lavatory.
    //  Should these nearby travelers be returned and tracked here in MileHigh,
    //    or should they be saved in the world model and be manipulated there via helpers?
    //  If the later, the existing world-helpers can be refactored to no longer pass "near" around.
  }
};
