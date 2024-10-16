const MOVE_SPEED = 200
const INVADER_SPEED = 200
let CURRENT_SPEED =  INVADER_SPEED
const LEVEL_DOWN = 300
const TIME_LEFT = 30
const BULLET_SPEED = 400

layer(['obj', 'ui'], 'obj')

//Creates the boundaries of the gamea

addLevel([
  '                  !           ^^^^^^^^^^       &',
  '                  !           ^^^^^^^^^^       &',
  '                  !           ^^^^^^^^^^       &',
  '                  !           ^^^^^^^^^^       &',
  '                  !                            &',
  '                  !                            &',
  '                  !                            &',
  '                  !                            &',
  '                  !                            &',
  '                  !                            &',
  '                  !                            &',
  '                  !                            &',
  '                  !                            &',
], {
  width: 30,
  height: 22,
  '^' : [sprite('space-invader'), scale(0.7), 'space-invader'],
  '!' : [sprite('wall'), 'left-wall'], 
  '&' : [sprite('wall'), 'right-wall'], 
})

//The space-ship is spawned
const player = add([
  sprite('space-ship'),
  pos(width() / 2, height() / 2),
  origin('center')
])

//Allows the user to control the space-ship
keyDown('left', () => {
  player.move(-MOVE_SPEED, 0)
})

keyDown('right', () => {
  player.move(MOVE_SPEED, 0)
})

//Spawns bullets
function spawnBullet(p) {
  add([
    rect(6,18), 
    pos(p), 
    origin('center'), 
    color(0.5, 0.5, 1), 
    'bullet'
    ])
}

//Bullets shoot on users command
keyPress('space', () => {
spawnBullet(player.pos.add(0, -25))
})

//Makes the bullets shootable
action('bullet', (b) => {
  b.move(0, -BULLET_SPEED)
  if (b.pos.y < 0){
    destroy(b)
  }
})

//Created so that the users bullets on impact create the score and make the screen shake
//while destroying the space-invaders
collides('bullet', 'space-invader' , (b,s) => {
  camShake(2)
  destroy(b)
  destroy(s)
  score.value++
  score.text = score.value  
})


//Keeps tracks of players score
const score = add([
  text('0'),
  pos(100, 50),
  layer('ui'),
  scale(3),
  {
    value: 0,
  }
])


//Keeps track of time
const timer = add([
  text('0'),
  pos(100, 150),
  scale(2),
  layer('ui'),
  {
    time: TIME_LEFT,
  },
])

//If the user loses will say lose
timer.action(() =>   {
  timer.time -= dt()
  timer.text = timer.time.toFixed(2)
  if(timer.time <= 0){
    go('lose', score.value)
  }
})

//If the user wins it will say you win
timer.action(() =>   {
  timer.time -= dt()
  timer.text = timer.time.toFixed(2)
  if(timer.time <= 0){
    go('win', score.value)
  }
})



//The aliens can not go passed the walls but also makes them move down
action('space-invader', (s) => {
s.move(CURRENT_SPEED, 0)
})

collides('space-invader', 'right-wall', () => {
 CURRENT_SPEED = -INVADER_SPEED
 every('space-invader', (s) => {
   s.move(0, LEVEL_DOWN)
 })
})

collides('space-invader', 'left-wall', () => {
 CURRENT_SPEED = INVADER_SPEED
 every('space-invader', (s) => {
   s.move(0, LEVEL_DOWN)
 })
})

//Created so that the space invaders don't go past the ship
player.overlaps('space-invader', () => {
  go('lose', { score: score.value })
})

action('space-invader', (s) => {
  if (s.pos.y >= (12 * 22)) {
      go('lose', { score: score.value })
  }
})