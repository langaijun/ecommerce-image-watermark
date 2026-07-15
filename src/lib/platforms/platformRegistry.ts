import type { PlatformPreset } from '@/lib/types';
import { amazonPreset } from './presets/amazon';
import { shopifyPreset } from './presets/shopify';
import { taobaoPreset } from './presets/taobao';
import { pinduoduoPreset } from './presets/pinduoduo';
import { ebayPreset } from './presets/ebay';
import { etsyPreset } from './presets/etsy';
import { jdPreset } from './presets/jd';
import { googleShoppingPreset } from './presets/googleShopping';

const allPresets: PlatformPreset[] = [
  amazonPreset,
  shopifyPreset,
  taobaoPreset,
  pinduoduoPreset,
  ebayPreset,
  etsyPreset,
  jdPreset,
  googleShoppingPreset,
];

class PlatformRegistry {
  private presets: Map<string, PlatformPreset> = new Map();

  constructor() {
    for (const preset of allPresets) {
      this.presets.set(preset.id, preset);
    }
  }

  getAll(): PlatformPreset[] {
    return Array.from(this.presets.values());
  }

  getById(id: string): PlatformPreset | undefined {
    return this.presets.get(id);
  }

  getByRegion(region: 'cn' | 'global' | 'all'): PlatformPreset[] {
    return this.getAll().filter((p) => {
      if (region === 'all') return true;
      return p.region === region;
    });
  }
}

export const platformRegistry = new PlatformRegistry();
