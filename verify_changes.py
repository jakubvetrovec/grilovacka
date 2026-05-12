#!/usr/bin/env python3
"""
Verifies that the changes images have the correct number of clusters
"""
from PIL import Image
import numpy as np
from scipy import ndimage

def verify_changes_image(set_num='01'):
    """
    Verifies a changes image has correct cluster count
    """
    changes_path = f'Pictures/Compare photos/Photo_{set_num}_changes.png'

    print(f"\n=== Verifying Photo_{set_num} ===")
    changes = Image.open(changes_path).convert('RGB')
    changes_arr = np.array(changes, dtype=np.uint8)

    # Detect red pixels (255, 0, 0)
    red_mask = (changes_arr[:,:,0] > 200) & (changes_arr[:,:,1] < 50) & (changes_arr[:,:,2] < 50)

    # Find connected components
    labeled_array, num_features = ndimage.label(red_mask)

    # Count clusters with minimum size
    min_size = 50
    valid_clusters = []
    for cluster_id in range(1, num_features + 1):
        cluster_size = np.sum(labeled_array == cluster_id)
        if cluster_size > min_size:
            valid_clusters.append(cluster_size)

    print(f"Total clusters: {len(valid_clusters)}")
    print(f"Cluster sizes: {sorted(valid_clusters)}")

    return len(valid_clusters) == 8

if __name__ == '__main__':
    results = {}
    for set_num in ['01', '02']:
        results[set_num] = verify_changes_image(set_num)

    print("\n=== VERIFICATION RESULT ===")
    if all(results.values()):
        print("✅ Both images have exactly 8 clusters!")
    else:
        print("❌ Some images don't have 8 clusters:")
        for set_num, is_valid in results.items():
            print(f"  Photo_{set_num}: {'✓' if is_valid else '✗'}")
