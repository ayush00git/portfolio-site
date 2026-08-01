/* Shared spatial constants for the Terminal Room. One source of truth
   so the player, the room and the terminal never disagree about space. */

export const ROOM = {
  size: 80,    // floor footprint (size × size), centred on origin
  height: 14,  // floor → ceiling
}

// player rigid-body spawn (capsule centre)
export const SPAWN = [0, 1.6, 18]

// terminal monolith group origin (sits against the north wall, z = -40)
export const TERMINAL_POS = [0, 0, -37.5]

// where the camera parks when the terminal is focused (dead-on the screen)
export const FOCUS_ANCHOR = [0, 2.05, -35.3]
