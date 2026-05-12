#!/usr/bin/env python3
"""
Simulates the minigame's clustering logic to verify 8 differences are detected
"""
from PIL import Image
import numpy as np

def simulate_minigame_detection(set_num='01'):
    """
    Simulates exactly what the minigame does:
    1. Loads the changes image
    2. Detects red pixels
    3. Groups them into clusters (BFS)
    4. Filters clusters < 50 pixels
    """
    changes_path = f'Pictures/Compare photos/Photo_{set_num}_changes.png'

    print(f"\n=== Testing Photo_{set_num} ===")
    changes = Image.open(changes_path).convert('RGB')
    changes_arr = np.array(changes, dtype=np.uint8)

    # Convert to numpy float32 like canvas getImageData
    imgData_flat = changes_arr.reshape(-1, 3)

    # Extract red pixels using minigame's logic:
    # if (a > 220 && r > 180 && r > g + 80 && r > b + 80)
    # (a is always 255 for PNG RGB, so check r > 180 && r > g + 80 && r > b + 80)
    red_pixels = set()
    width = changes_arr.shape[1]

    for i in range(len(imgData_flat)):
        r, g, b = imgData_flat[i]
        # Minigame checks: r > 180 AND r > g + 80 AND r > b + 80
        if r > 180 and r > g + 80 and r > b + 80:
            red_pixels.add(i)

    print(f"Red pixels detected: {len(red_pixels)}")

    # BFS clustering like minigame does
    clusters = []
    visited = set()

    for pixel_idx in red_pixels:
        if pixel_idx in visited:
            continue

        cluster = []
        queue = [pixel_idx]

        while queue:
            idx = queue.pop(0)
            if idx in visited or idx not in red_pixels:
                continue
            visited.add(idx)
            cluster.append(idx)

            row = idx // width
            col = idx % width
            neighbors = [
                (row - 1) * width + col,
                (row + 1) * width + col,
                row * width + (col - 1),
                row * width + (col + 1)
            ]

            for n in neighbors:
                if n not in visited and n in red_pixels:
                    queue.append(n)

        # Filter clusters < 50 pixels (minigame does this)
        if len(cluster) > 50:
            clusters.append(cluster)

    print(f"Clusters (>50px): {len(clusters)}")
    for i, cluster in enumerate(clusters):
        print(f"  Cluster {i}: {len(cluster)} pixels")

    return len(clusters)

def test_with_set():
    """Test both sets"""
    print("=" * 50)
    print("SIMULATING MINIGAME CLUSTERING LOGIC")
    print("=" * 50)

    for set_num in ['01', '02']:
        count = simulate_minigame_detection(set_num)
        status = "✓ PASS" if count == 8 else f"✗ FAIL ({count}/8)"
        status_ascii = "PASS" if count == 8 else f"FAIL ({count}/8)"
    print(f"Photo_{set_num}: {status_ascii}\n")

if __name__ == '__main__':
    test_with_set()
