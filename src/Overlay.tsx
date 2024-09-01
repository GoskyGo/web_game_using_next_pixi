import { Block } from "./GridUtils"

interface OverlayProps {
    blocks: Block[]
    onSelect: (block: Block) => void
    position: { x: number, y: number }
}

const Overlay = (props: OverlayProps) => {
    return (
        <div 
            className="overlay"
        >
            { props.blocks.map(block => (
                <img 
                    className="block-item" 
                    src={block.url} alt="block" 
                    key={block.url}
                    onClick={() => props.onSelect(block)}
                />
            )) }
        </div>
    )
}

export default Overlay