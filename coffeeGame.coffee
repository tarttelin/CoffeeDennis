FPS = 20

class GameLoop
    
    constructor: (@canvas) ->
        @buffer = document.createElement('canvas')
        @buffer.width = @canvas.width
        @buffer.height = @canvas.height
        @backBuffer = @buffer.getContext('2d')
        @context2D = @canvas.getContext('2d')
        @bindKeys()
        @backBuffer.width = @canvas.width
        @backBuffer.height = @canvas.height
        @createLevels([@level1, @level2, @level3], 0)
    
    level1: () =>
        @drawRoads(@backBuffer, '#0F0')
        @sprites = [new DennisBike(0, 100), new House(300, 100),  new Ambulance(0, 200), new Spider(400, 400)]
        
    level2: () =>
        @drawRoads(@backBuffer, '#FFF')
        @sprites = [new DennisBike(0, 100), new House(300, 100), new House(100, 300), new Ambulance(0, 200), new Spider(400, 400)]

    level3: () =>
        @drawRoads(@backBuffer, '#00F')
        @sprites = [new DennisBike(0, 100), new House(300, 100), new BeachBall(100, 300), new Ambulance(0, 200), new Spider(400, 400)]

    drawLevel: (level, callback) =>
        @clear()
        @backBuffer.strokeStyle = '#00AA00'
        @backBuffer.font = '40px san-serif'
        @backBuffer.textBaseline = 'bottom'
        @backBuffer.textAlign = 'center'
        @backBuffer.strokeText("Level #{level}", @backBuffer.width / 2, 200)
        @context2D.drawImage(@buffer, 0,0)
        setTimeout(callback, 2000)

    gameOver: () =>
        clearInterval(@interval)
        @clear()
        @backBuffer.strokeStyle = '#00AA00'
        @backBuffer.font = '40px san-serif'
        @backBuffer.textBaseline = 'bottom'
        @backBuffer.textAlign = 'center'
        @backBuffer.strokeText("Game Complete", @backBuffer.width / 2, 200)
        @context2D.drawImage(@buffer, 0,0)

    createLevels: (levels, idx) =>
        @clear()
        clearInterval(@interval)
        @drawLevel idx + 1, () =>
            @clear()
            levels[idx]()
            @playerSprite = @sprites[0]
            @interval = setInterval(@draw, 1000/FPS)
            @playerSprite.nextLevel = () =>
                if levels.length > idx + 1
                    @createLevels(levels, idx + 1)
                else
                    @gameOver()
            @playerSprite.restartLevel = () =>
                @createLevels(levels, idx)
    
    clear: () =>
        @backBuffer.fillStyle = '000'
        @backBuffer.fillRect(0,0,@canvas.width, @canvas.height)
    
    bindKeys: () =>
        keyDown = (evt) =>
            switch evt.which
                when 37 then @playerSprite.stop()
                when 38  
                    @playerSprite.jump()
                    evt.preventDefault()
                when 39  then @playerSprite.forward()
                
        window.addEventListener('keydown', keyDown, false);
    
    draw: () =>
        for sprite in @sprites
            if sprite.collideWith(@sprites)
                return
            if sprite.draw(@backBuffer)
                return
        @context2D.drawImage(this.buffer, 0, 0)
            
    drawRoads: (surface, color) =>
        surface.fillStyle = color
        for y in [100..400] by 100
            surface.fillRect(0, y, @canvas.width, 5)
        
class Sprite
    constructor: (@x, @y) ->
        @currentVector = new Vector(0,0)
        @width = @height = 0
        
    move: (vector) =>
        @currentVector = @currentVector.move(vector)
        
    draw: (surface) =>
        
    hit: (sprite) =>
        
    clearAndMove: (surface) =>
        surface.fillStyle = '000'
        surface.fillRect(@x, @y, @width, @height)
        @x += @currentVector.x
        @y += @currentVector.y
        
    collideWith: (sprites) =>
        isColliding = (sprite) =>
            sprite.x < @x + @width and sprite.x + sprite.width > @x and sprite.y < @y + @height and sprite.y + sprite.height > @y
        collisions = ( sprite for sprite in sprites when sprite isnt this and isColliding sprite )
        @hit(collisions[0]) if collisions.length > 0

class Vector
    constructor: (@x, @y) ->
    
    move: (position) =>
        new Vector(position.x + @x, position.y + @y)
        
class House extends Sprite

    constructor: (x, y) ->
        super x, y - 46
        @height = 46
        @width = 40
    
    draw: (surface) =>
        surface.fillStyle = 'white'
        surface.fillRect(@x, @y + 20, 40, 26)
        surface.fillStyle = 'black'
        surface.fillRect(@x + 3, @y + 22, 10, 6)
        surface.fillStyle = 'blue'
        surface.fillRect(@x + 3, @y + 30, 10, 16)
        surface.fillStyle = '#0F0'
        surface.fillRect(@x + 18, @y + 22, 18, 14)
        surface.fillStyle = 'black'
        surface.fillRect(@x + 22, @y + 22, 10, 14)
        surface.fillStyle = 'white'
        surface.fillRect(@x + 18, @y + 28, 18, 2)
        surface.fillStyle = 'red'
        surface.fillRect(@x, @y + 16, 40, 4)
        surface.fillRect(@x + 4, @y + 12, 32, 4)
        surface.fillRect(@x + 8, @y + 8, 24, 4)
        surface.fillRect(@x + 12, @y + 4, 16, 4)
        surface.fillRect(@x + 16, @y, 8, 4)
        surface.fillStyle = 'white'
        surface.fillRect(@x + 32, @y + 6, 3, 6)
        
class DennisBike extends Sprite
    
    constructor: (x, y) ->
        super x, y - 33
        @height = 33
        @width = 24
        @jumpMovement = [-5,0,0,0,0,0,0,0,2,0,0,0,0,2,0,0,0,1,0,0,0,0,0,1,0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,-5]

    forward: () =>
        @move(new Vector(1,0))
        
    stop: () =>
        @currentVector = new Vector(0,@currentVector.y)
        
    jump: () =>
        @jumpInProgress = @jumpMovement.slice() if not @jumpInProgress?.length > 0
        @jumping = true
        
    doJump: () =>
        @jumping = @jumpInProgress?.length > 0
        if @jumping
            @move(new Vector(0, @jumpInProgress.pop()))

    hit: (otherSprite) =>
        alert "Crash"
        @restartLevel()
        true

    draw: (surface) =>
        @clearAndMove(surface)
        if @jumping?= true
            @doJump()
        if @x >= surface.width
            @x = 0
            @y += 100
        if @y > surface.height
            @nextLevel()
            return true
        else
            @drawDennis(surface)
    
    drawDennis: (surface) =>        
        surface.fillStyle = 'red'
        surface.fillRect(@x, @y, 10, 10)
        surface.fillRect(@x + 10, @y, 5, 3)
        surface.fillStyle = '#00F'
        surface.fillRect(@x + 11, @y + 3, 3, 3)
        surface.fillStyle = 'purple'
        surface.fillRect(@x + 10, @y + 3, 1, 7)
        surface.fillRect(@x + 11, @y + 6, 7, 4)
        surface.fillStyle = '#0F0'
        surface.fillRect(@x + 4, @y + 10, 10, 15)
        surface.fillStyle = 'white'
        surface.fillRect(@x, @y + 25, 8, 8)
        surface.fillRect(@x + 14, @y + 25, 8, 8)
        surface.fillStyle = 'black'
        surface.fillRect(@x + 2, @y + 27, 4, 4)
        surface.fillRect(@x + 16, @y + 27, 4, 4)
        surface.fillStyle = 'white'
        surface.fillRect(@x + 17, @y + 18, 2, 7)
        surface.fillStyle = '#00F'
        surface.fillRect(@x + 17, @y + 16, 2, 2)
        surface.fillStyle = 'yellow'
        surface.fillRect(@x + 6, @y + 16, 11, 2)
        surface.fillRect(@x + 15, @y + 15, 4,1)
        surface.fillStyle = '#0F0'
        surface.fillRect(@x, @y + 25, 18, 2)
        surface.fillStyle = 'red'
        surface.fillRect(@x + 12, @y + 27, 6, 4)
        
class Ambulance extends Sprite

    constructor: (x, y) ->
        super x, y - 28
        @height = 28
        @width = 28
        @move(new Vector(5,0))

    draw: (surface) =>
        @clearAndMove(surface) 
        @x = 0 if @x > surface.width
        surface.fillStyle = 'blue'
        surface.fillRect(@x + 10, @y, 10, 2)
        surface.fillStyle = 'white'
        surface.fillRect(@x, @y + 2, 20, 20)
        surface.fillRect(@x + 20, @y + 5, 8, 1)
        surface.fillRect(@x + 20, @y + 18, 8, 2)
        surface.fillRect(@x, @y + 20, 8, 8)
        surface.fillRect(@x + 18, @y + 20, 8, 8)
        surface.fillStyle = 'black'
        surface.fillRect(@x + 2, @y + 22, 4, 4)
        surface.fillRect(@x + 20, @y + 22, 4, 4)
        surface.fillStyle = 'cyan'
        surface.fillRect(@x, @y + 20, 28, 2)
        surface.fillRect(@x + 20, @y + 6, 8, 12)
        surface.fillStyle = 'red'
        surface.fillRect(@x + 8, @y + 4, 4, 12)
        surface.fillRect(@x + 4, @y + 8, 12, 4)
        
class Spider extends Sprite

    constructor: (x, y) ->
        super x, y-95
        @width = 30
        @height = 40
        @heightMovement = 2
        
    draw: (surface) =>
        @clearAndMove(surface)
        @height += @heightMovement
        @heightMovement *= -1 if @height > 80 or @height < 40
        surface.fillStyle = 'yellow'
        surface.fillRect(@x + 13, @y, 4, @height - 25)
        surface.fillStyle = 'F00'
        surface.fillRect(@x, @y + @height - 25, 30, 20)
        surface.fillStyle = 'cyan'
        surface.fillRect(@x, @y + @height - 4, 4, 4)
        surface.fillRect(@x + 9, @y + @height - 4, 4, 4)
        surface.fillRect(@x + 18, @y + @height - 4, 4, 4)
        surface.fillRect(@x + 26, @y + @height - 4, 4, 4)
        surface.fillStyle = '000'
        surface.fillRect(@x + 4, @y + @height - 21, 4, 4)
        surface.fillRect(@x + 22, @y + @height - 21, 4, 4)
        
class Bouncy extends Sprite
    
    constructor: (x, y) ->
        super x, y
        @bounce = [-5,0,0,0,0,0,0,0,2,0,0,0,0,2,0,0,0,1,0,0,0,0,0,1,0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,-5]
        @idx = 0
        
    draw: (surface) =>
        @move(new Vector(0, @bounce[@idx++]))
        if @idx is @bounce.length
            @idx = 0
        @clearAndMove(surface)
        
        
class BeachBall extends Bouncy
    
    constructor: (x, y) ->
        super x, y - 20
        @width = @height = 20
        
    draw: (surface) =>
        super surface
        surface.beginPath()
        surface.arc(@x + 10, @y + 10, 10, 0, 2 * Math.PI, false)
        surface.fillStyle = 'F00'
        surface.fill()
        
class Zebedee extends Bouncy

    constructor: (x, y) ->
        super x, y - 20
        @width = @height = 20
        
    draw: (surface) =>
        super surface
        surface.beginPath()
        surface.arc(@x + 10, @y + 10, 10, 0, 2 * Math.PI, false)
        surface.fillStyle = 'F00'
        surface.fill()
        
class Tree extends Sprite

    constructor: (x, y) ->
        super x, y
    
    draw: (surface) =>
        
window.GameLoop = GameLoop