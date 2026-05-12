#!/usr/bin/env python3
"""
Skript pro opravu změnových obrázků
Porovnává originální a změnovou fotku a vytváří mapu rozdílů
s lépe nastavenými prahami
"""
from PIL import Image
import numpy as np
from scipy import ndimage

def count_clusters(red_pixels, width):
    """Spočítá počet clusterů (spojených komponent) s minimální velikostí 50 pixelů"""
    if not red_pixels:
        return 0

    # Vytvoř binární mapu
    binary_map = np.zeros((max(p // width for p in red_pixels) + 1, width), dtype=bool)
    for pixel_idx in red_pixels:
        row = pixel_idx // width
        col = pixel_idx % width
        binary_map[row, col] = True

    # Najdi spojené komponenty
    labeled_array, num_features = ndimage.label(binary_map)

    # Spočítej pixely v každém clusteru a filtruj
    valid_clusters = 0
    for cluster_id in range(1, num_features + 1):
        cluster_size = np.sum(labeled_array == cluster_id)
        if cluster_size > 50:
            valid_clusters += 1

    return valid_clusters

def test_percentiles(set_num='01'):
    """Testuje různé percentily a vrací počty clusterů"""
    orig_path = f'Pictures/Compare photos/Photo_{set_num}A.png'
    diff_path = f'Pictures/Compare photos/Photo_{set_num}B.png'

    print(f"\n=== Testování percentilů pro set {set_num} ===")
    orig = Image.open(orig_path).convert('RGB')
    diff = Image.open(diff_path).convert('RGB')

    # Vyrovnej velikosti
    min_w = min(orig.width, diff.width)
    min_h = min(orig.height, diff.height)
    orig = orig.crop((0, 0, min_w, min_h))
    diff = diff.crop((0, 0, min_w, min_h))

    # Vypočítej rozdíly
    orig_arr = np.array(orig, dtype=np.float32)
    diff_arr = np.array(diff, dtype=np.float32)
    diff_map = np.sqrt(np.sum((orig_arr - diff_arr) ** 2, axis=2))

    # Testuj percentily
    percentiles = [98.5, 98.6, 98.65, 98.7, 98.75, 98.8, 98.85, 98.9, 99.0]
    results = []

    for perc in percentiles:
        mask = diff_map > np.percentile(diff_map[diff_map > 10], perc)
        red_pixels = set(np.where(mask.flatten())[0])
        num_clusters = count_clusters(red_pixels, min_w)
        results.append((perc, num_clusters))
        print(f"  Percentil {perc}: {num_clusters} clusterů")

    return results

def fix_changes_image(set_num='01', percentile=98.77):
    """
    Vytvoří opravenou mapu rozdílů (changes image)
    """
    # Načti fotky
    orig_path = f'Pictures/Compare photos/Photo_{set_num}A.png'
    diff_path = f'Pictures/Compare photos/Photo_{set_num}B.png'
    output_path = f'Pictures/Compare photos/Photo_{set_num}_changes.png'

    print(f"Načítám fotky pro set {set_num}...")
    orig = Image.open(orig_path).convert('RGB')
    diff = Image.open(diff_path).convert('RGB')

    # Vyrovnej velikosti - vezmi menší
    min_w = min(orig.width, diff.width)
    min_h = min(orig.height, diff.height)
    orig = orig.crop((0, 0, min_w, min_h))
    diff = diff.crop((0, 0, min_w, min_h))
    print(f"Velikost fotek: {min_w}x{min_h}")

    # Převeď na numpy arrays
    orig_arr = np.array(orig, dtype=np.float32)
    diff_arr = np.array(diff, dtype=np.float32)

    # Vypočítej rozdíly mezi pixely
    # Používám L2 vzdálenost v RGB prostoru
    diff_map = np.sqrt(np.sum((orig_arr - diff_arr) ** 2, axis=2))

    # Vytvoř output - černé pozadí
    output = Image.new('RGB', (min_w, min_h), color=(0, 0, 0))
    output_arr = np.array(output, dtype=np.uint8)

    # Nastav práh
    threshold = np.percentile(diff_map[diff_map > 10], percentile)
    print(f"Práh rozdílnosti (percentil {percentile}): {threshold:.2f}")

    # Označ rozdílné pixely červeně (255, 0, 0)
    mask = diff_map > threshold
    output_arr[mask] = [255, 0, 0]

    # Uložit
    output_img = Image.fromarray(output_arr)
    output_img.save(output_path)
    print(f"Uloženo: {output_path}")

    # Statistika
    num_red_pixels = np.sum(mask)
    red_pixels = set(np.where(mask.flatten())[0])
    num_clusters = count_clusters(red_pixels, min_w)
    print(f"Počet červených pixelů: {num_red_pixels}")
    print(f"Počet clusterů (min 50px): {num_clusters}")

if __name__ == '__main__':
    # Nejdřív testuj percentily
    for set_num in ['01', '02']:
        try:
            test_percentiles(set_num)
        except Exception as e:
            print(f"Chyba při testování {set_num}: {e}")

    print("\n=== Generování finálních obrázků ===")
    # Oprav set 01 a 02 se set-specifickými percentily
    percentiles = {'01': 98.6, '02': 98.65}  # 98.65 pro Photo_02 dá přesně 8
    for set_num in ['01', '02']:
        try:
            fix_changes_image(set_num, percentile=percentiles[set_num])
            print()
        except Exception as e:
            print(f"Chyba pro set {set_num}: {e}\n")
