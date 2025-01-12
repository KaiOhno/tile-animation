
import { useState, useEffect } from 'react';

const TileAnimation = () => {
  const [tiles, setTiles] = useState([]);
  const [tileSize, setTileSize] = useState(30);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [colors, setColors] = useState(['#ffffff']); // Start with white
  const [newColor, setNewColor] = useState('#ffffff');
  const [key, setKey] = useState(0);
  
  const generateTiles = () => {
    const numRows = Math.ceil(window.innerHeight / tileSize);
    const numCols = Math.ceil(window.innerWidth / tileSize);
    const newTiles = [];
    
    const centerRow = Math.floor(numRows / 2);
    const centerCol = Math.floor(numCols / 2);
    
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        const distanceFromCenter = Math.sqrt(
          Math.pow(i - centerRow, 2) + 
          Math.pow(j - centerCol, 2)
        );
        
        const baseDelay = distanceFromCenter * (150 / animationSpeed);
        const randomOffset = Math.random() * (800 / animationSpeed);
        const delay = baseDelay + randomOffset;
        
        const duration = (500 / animationSpeed) + Math.random() * (300 / animationSpeed);
        
        // Random color selection from colors array
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random rotation and scale variations
        const rotation = Math.random() * 360;
        const scale = 0.8 + Math.random() * 0.4;
        
        newTiles.push({
          id: `${i}-${j}-${key}`,
          delay,
          duration,
          row: i,
          col: j,
          x: j * tileSize,
          y: i * tileSize,
          color: randomColor,
          rotation,
          scale
        });
      }
    }
    
    newTiles.sort((a, b) => {
      const randomFactor = Math.random() * 0.3;
      return (a.delay * (1 - randomFactor)) - (b.delay * (1 - randomFactor));
    });
    
    setTiles(newTiles);
  };
  
  useEffect(() => {
    generateTiles();
    
    const handleResize = () => {
      generateTiles();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [tileSize, animationSpeed, colors, key]);
  
  const handleReset = () => {
    setKey(prev => prev + 1);
  };
  
  const addColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
    }
  };
  
  const removeColor = (colorToRemove) => {
    if (colors.length > 1) {
      setColors(colors.filter(color => color !== colorToRemove));
    }
  };

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      <div className="absolute inset-0">
        {tiles.map((tile) => (
          <div
            key={tile.id}
            className="absolute opacity-0 animate-tileReveal"
            style={{
              left: `${tile.x}px`,
              top: `${tile.y}px`,
              width: `${tileSize}px`,
              height: `${tileSize}px`,
              backgroundColor: tile.color,
              animationDelay: `${tile.delay}ms`,
              animationDuration: `${tile.duration}ms`,
              animationFillMode: 'forwards',
              transform: `rotate(${tile.rotation}deg) scale(${tile.scale})`
            }}
          />
        ))}
      </div>
      
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-4 bg-black/50 p-4 rounded">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <label className="text-white text-sm mb-1">Tile Size</label>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={tileSize} 
              onChange={(e) => setTileSize(Number(e.target.value))}
              className="w-32"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-white text-sm mb-1">Animation Speed</label>
            <input 
              type="range" 
              min="0.5" 
              max="2" 
              step="0.1"
              value={animationSpeed} 
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              className="w-32"
            />
          </div>
          
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-white rounded hover:bg-gray-200 transition-colors h-8 mt-auto"
          >
            Reset
          </button>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-white text-sm">Colors</label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color, index) => (
              <div 
                key={index} 
                className="flex items-center gap-1"
              >
                <div 
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: color }}
                />
                <button
                  onClick={() => removeColor(color)}
                  className="text-white hover:text-red-500 text-sm px-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <input 
              type="color" 
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-8 h-8"
            />
            <button
              onClick={addColor}
              className="px-2 py-1 bg-white rounded hover:bg-gray-200 transition-colors text-sm"
            >
              Add Color
            </button>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes tileReveal {
          0% { 
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          100% { 
            opacity: 1;
            transform: scale(var(--scale)) rotate(var(--rotation));
          }
        }
        
        .animate-tileReveal {
          animation: tileReveal 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          --scale: var(--tile-scale);
          --rotation: var(--tile-rotation);
        }
      `}</style>
    </div>
  );
};

export default TileAnimation;