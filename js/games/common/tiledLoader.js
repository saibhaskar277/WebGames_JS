// Tiled Map Loader for games

async function loadTiledMap(filePath) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', filePath, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        console.log('Tiled map loaded successfully via XMLHttpRequest');
                        resolve(data);
                    } catch (error) {
                        console.error('Error parsing Tiled JSON:', error);
                        reject(error);
                    }
                } else {
                    console.error('Failed to load Tiled map:', xhr.status, xhr.statusText);
                    reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
                }
            }
        };
        xhr.onerror = function() {
            console.error('Network error loading Tiled map');
            reject(new Error('Network error'));
        };
        xhr.send();
    });
}

function parseTiledObstacles(tiledData, tileSize = 32) {
    const obstacles = [];
    if (!tiledData || !tiledData.layers) {
        console.warn('No layers found in Tiled data');
        return obstacles;
    }
    
    console.log('Available layers:', tiledData.layers.map(l => l.name));
    
    // Find the tile layer (first tilelayer, doesn't need specific name)
    const tileLayer = tiledData.layers.find(layer => layer.type === 'tilelayer');
    if (!tileLayer) {
        console.warn('No tile layer found');
        return obstacles;
    }
    
    if (!tileLayer.data) {
        console.warn('No tile data in layer');
        return obstacles;
    }
    
    console.log('Tile data length:', tileLayer.data.length, 'Map width:', tiledData.width, 'Tile size:', tileSize);
    const mapWidth = tiledData.width;
    
    // Parse tile indices to get obstacle positions
    // Non-zero tile IDs represent obstacles
    tileLayer.data.forEach((tileId, index) => {
        if (tileId > 0) { // Non-zero tile ID means obstacle
            const x = (index % mapWidth) * tileSize;
            const y = Math.floor(index / mapWidth) * tileSize;
            obstacles.push({x, y, size: tileSize});
        }
    });
    
    console.log('Obstacles parsed:', obstacles.length);
    return obstacles;
}