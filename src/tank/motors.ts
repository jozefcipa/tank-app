// Command: motors=LF:RB
// Reply: OK
// Explanation
// L - left motor
// R - right motor
// F - go forwards
// B - go backwards
// 0 - stop
// e.g. LF:R0 -> turn to right
// e.g. LB:RF -> turn to left in place
// e.g. LB:RB -> both reverse
// e.g. LF:RF -> both forward
// await tank.motors.turn({ left: MotorDirection.Forward, right: MotorDirection.Backward })

import { MotorDirection, Periphery, PeripheryType } from './types'

interface MotorDirections {
  left: MotorDirection
  right: MotorDirection
}

export const motors: Periphery<PeripheryType.Motors> = {
  type: PeripheryType.Motors,
  actions: {
    turn: (directions: MotorDirections) => `L${directions.left}:R${directions.right}`,
  },
  decodeValue: () => ({}),
}
