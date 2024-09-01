import './css/App.css'
import '@pixi/events'
import { Viewport } from 'pixi-viewport'
import * as PIXI from 'pixi.js'
import { useEffect, useRef, useState } from 'react'
import { Sprite, Stage } from '@pixi/react'
import config from './config.ts'
import DebugHitbox from './DebugHitbox.tsx'
import { Block, createHitbox, generateGrid, screenToIso, Tile } from './GridUtils'
import Overlay from './Overlay.tsx'
import { PixiViewport } from './PixiViewport.tsx'

const App = () => {
  const blocks: Block[] = [
    { url: '/img/iso/block.png', offset: 0, hitboxOffset: 0 },
    { url: '/img/iso/tree-point.png', offset: -37, hitboxOffset: 17 },
    { url: '/img/iso/tree-block.png', offset: -37, hitboxOffset: 21 },
    { url: '/img/iso/bush.png', offset: 0, hitboxOffset: 21 },
    { url: '/img/iso/water-3.png', offset: 0, hitboxOffset: 21 },
    { url: '/img/iso/house.png', offset: -22, hitboxOffset: 21 },
    { url: '/img/iso/mansion-1.png', offset: -19, hitboxOffset: 19 },
    { url: '/img/iso/mansion-2.png', offset: -28, hitboxOffset: 21 },
    // { url: '/img/iso/apartments-small.png', offset: -60, hitboxOffset: 60 },
    // { url: '/img/iso/apartments-large.png', offset: -115, hitboxOffset: 115 },
    { url: '/img/iso/road-l.png', offset: 0, hitboxOffset: 0 },
    { url: '/img/iso/road-r.png', offset: 0, hitboxOffset: 0 },
    { url: '/img/iso/road-corner-ru.png', offset: 0, hitboxOffset: 0 },
    { url: '/img/iso/road-corner-rd.png', offset: 0, hitboxOffset: 0 },
    { url: '/img/iso/road-corner-lu.png', offset: 0, hitboxOffset: 0 },
    { url: '/img/iso/road-corner-ld.png', offset: 0, hitboxOffset: 0 },
  ]

  const [grid, setGrid] = useState<Tile[]>(() => generateGrid(config.gridSize[0], config.gridSize[1], blocks[0]))
  const [overlayPosition, setOverlayPosition] = useState<{
    x: number
    y: number
  }>({ x: 0, y: 0 })
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null)

  const viewportRef = useRef<Viewport>(null)

  const changeBlock = (block: Block) => {
    if (!selectedTile) {
      return
    }

    const updatedGrid = grid.map((t) => (t.x === selectedTile.x && t.y === selectedTile.y ? { ...t, block } : t))

    setGrid(updatedGrid)
    setSelectedTile(null)
  }

  const selectTile = (tile: Tile, event: PIXI.FederatedPointerEvent) => {
    setSelectedTile(tile)
    setOverlayPosition({ x: event.clientX + 10, y: event.clientY })
  }

  const debug = config.debug

  const tileWidth = 93
  const tileHeight = 112

  // Add padding for isometric perspective
  const paddingX = tileWidth * (config.gridSize[0] - 1)
  const paddingY = tileHeight

  const worldWidth = config.gridSize[0] * tileWidth
  const worldHeight = config.gridSize[1] * (tileHeight / 2) + paddingY

  const stageWidth = config.viewport[0]
  const stageHeight = config.viewport[1]

  useEffect(() => {
    window.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault()
      },
      { passive: false }
    )
  }, [])

  useEffect(() => {
    if (viewportRef.current) {
      // Use a timeout to ensure PixiJS has fully rendered
      setTimeout(() => {
        viewportRef.current?.moveCenter(worldWidth / 2, worldHeight / 2)
      }, 0) // Adjust timeout as needed if you experience issues
    }
  }, [worldWidth, worldHeight])

  return (
    <>
      {selectedTile && <Overlay blocks={blocks} onSelect={changeBlock} position={overlayPosition} />}
      <Stage height={stageHeight} width={stageWidth} options={{ backgroundColor: 0xffffff }}>
        <PixiViewport
          ref={viewportRef}
          screenWidth={stageWidth}
          screenHeight={stageHeight}
          worldWidth={worldWidth}
          worldHeight={worldHeight}
        >
          {grid.map((tile) => {
            const [isoX, isoY] = screenToIso(tile.x, tile.y, tileWidth, tileHeight)

            const hitArea = createHitbox()

            const isSelected = selectedTile && selectedTile.x === tile.x && selectedTile.y === tile.y

            return (
              <>
                {debug && (
                  <DebugHitbox
                    hitbox={hitArea}
                    x={isoX + paddingX / 2}
                    y={isoY + tile.block.offset + tile.block.hitboxOffset + paddingY / 2}
                    key={`hitarea-${tile.x}-${tile.y}`}
                  />
                )}

                <Sprite
                  image={tile.block.url}
                  x={isoX + paddingX / 2}
                  y={isoY + tile.block.offset + paddingY / 2}
                  key={`${tile.x}-${tile.y}`}
                  interactive={true}
                  hitArea={hitArea}
                  tint={isSelected ? 0xcccccc : 0xffffff}
                  pointerdown={(event) => selectTile(tile, event)}
                  pointerover={(event) => !isSelected && (event.currentTarget.tint = 0xcccccc)}
                  pointerout={(event) => !isSelected && (event.currentTarget.tint = 0xffffff)}
                />
              </>
            )
          })}
        </PixiViewport>
      </Stage>
    </>
  )
}

export default App
