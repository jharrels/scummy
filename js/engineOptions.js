engineOptions = {
  access: [],
  adl: [
    {
      shortDesc: 'TV emulation',
      longDesc: 'Emulate composite output to an NTSC TV',
      flag: 'ntsc'
    },
    {
      shortDesc: 'Color graphics',
      longDesc: 'Use color graphics instead of monochrome',
      flag: 'color'
    },
    {
      shortDesc: 'Color graphics',
      longDesc: 'Use color graphics instead of monochrome',
      flag: 'color'
    },
    {
      shortDesc: 'Show scanlines',
      longDesc: 'Darken every other scanline to mimic the look of a CRT',
      flag: 'scanlines'
    },
    {
      shortDesc: 'Always use sharp monochrome text',
      longDesc: 'Do not emulate NTSC artifacts for text',
      flag: 'monotext'
    }
  ],
  agi: [
    {
      shortDesc: 'Use original save/load screens',
      longDesc: 'Use the original save/load screens instead of the ScummVM ones',
      flag: 'originalsaveload'
    },
    {
      shortDesc: 'Use an alternative palette',
      longDesc: 'Use an alternative palette, common for all Amiga games. This was the old behavior',
      flag: 'altamigapalette'
    },
    {
      shortDesc: 'Mouse support',
      longDesc: 'Enables mouse support. Allows to use mouse for movement and in game menus.',
      flag: 'mousesupport'
    },
    {
      shortDesc: 'Use Hercules hires font',
      longDesc: 'Uses Hercules hires font, when font file is available.',
      flag: 'herculesfont'
    },
    {
      shortDesc: 'Pause when entering commands',
      longDesc: 'Shows a command prompt window and pauses the game (like in SCI) instead of a real-time prompt.',
      flag: 'commandpromptwindow'
    },
    {
      shortDesc: 'Add speed menu',
      longDesc: 'Add game speed menu (similar to PC version)',
      flag: 'apple2gs_speedmenu'
    }
  ],
  agos: [],
  avalanche: [],
  bbvs: [],
  bladerunner: [
    {
      shortDesc: 'Sitcom mode',
      longDesc: "Game will add laughter after actor's line or narration",
      flag: 'sitcom'
    },
    {
      shortDesc: 'Shorty mode',
      longDesc: 'Game will shrink the actors and make their voices high pitched',
      flag: 'shorty'
    },
    {
      shortDesc: 'Frame limiter high performance mode',
      longDesc: 'This mode may result in high CPU usage! It avoids use of delayMillis() function.',
      flag: 'nodelaymillisfl'
    },
    {
      shortDesc: 'Max frames per second limit',
      longDesc: 'This mode targets a maximum of 120 fps. When disabled, the game targets 60 fps',
      flag: 'frames_per_secondfl'
    },
    {
      shortDesc: "Disable McCoy's quick stamina drain",
      longDesc: "When running, McCoy won't start slowing down as soon as the player stops clicking the mouse",
      flag: 'disable_stamina_drain'
    }
  ],
  buried: [],
  cge: [
    {
      shortDesc: 'Color Blind Mode',
      longDesc: 'Enable Color Blind Mode by default',
      flag: 'enable_color_blind'
    }
  ],
  cge2: [
    {
      shortDesc: 'Color Blind Mode',
      longDesc: 'Enable Color Blind Mode by default',
      flag: 'enable_color_blind'
    }
  ],
  chewy: [],
  cine: [
    {
      shortDesc: 'Use original save/load screens',
      longDesc: 'Use the original save/load screens instead of the ScummVM ones',
      flag: 'originalsaveload'
    },
    {
      shortDesc: 'Use transparent dialog boxes in 16 color scenes',
      longDesc: 'Use transparent dialog boxes in 16 color scenes even if the original game version did not support them',
      flag: 'transparentdialogboxes'
    }
  ],
  composer: [],
  cruise: [],
  cryo: [],
  cryomni3d: [],
  director: [],
  dm: [],
  draci: [],
  dragons: [],
  drascula: [],
  dreamweb: [
    {
      shortDesc: 'Use original save/load screens',
      longDesc: 'Use the original save/load screens instead of the ScummVM ones',
      flag: 'originalsaveload'
    },
    {
      shortDesc: 'Use bright palette mode',
      longDesc: "Display graphics using the game's bright palette",
      flag: 'bright_palette'
    }
  ],
  gnap: [],
  gob: [],
  griffon: [],
  grim: [
    {
      shortDesc: 'Load user patch (unsupported)',
      longDesc: "Load an user patch. Please note that the ScummVM team doesn't provide support for using such patches.",
      flag: 'datausr_load'
    },
    {
      shortDesc: 'Show FPS',
      longDesc: 'Show the current FPS-rate, while you play.',
      flag: 'show_fps'
    }
  ],
  groovie: [
    {
      shortDesc: 'Fast movie speed',
      longDesc: 'Play movies at an increased speed',
      flag: 'fast_movie_speed'
    }
  ],
  hadesch: [],
  hdb: [
    {
      shortDesc: 'Enable cheat mode',
      longDesc: 'Debug info and level selection becomes available',
      flag: 'hypercheat'
    }
  ],
  hopkins: [
    {
      shortDesc: 'Gore Mode',
      longDesc: 'Enable Gore Mode when available',
      flag: 'enable_gore'
    },
    {
      shortDesc: 'Gore Mode',
      longDesc: 'Enable Gore Mode when available',
      flag: 'enable_gore'
    }
  ],
  hugo: [],
  icb: [],
  illusions: [],
  kingdom: [],
  kyra: [
    {
      shortDesc: 'Studio audience',
      longDesc: 'Enable studio audience',
      flag: 'studio_audience'
    },
    {
      shortDesc: 'Skip support',
      longDesc: 'Allow text and cutscenes to be skipped',
      flag: 'skip_support'
    },
    {
      shortDesc: 'Helium mode',
      longDesc: 'Enable helium mode',
      flag: 'helium_mode'
    },
    {
      shortDesc: 'Smooth scrolling',
      longDesc: 'Enable smooth scrolling when walking',
      flag: 'smooth_scrolling'
    },
    {
      shortDesc: 'Floating cursors',
      longDesc: 'Enable floating cursors',
      flag: 'floating_cursors'
    },
    {
      shortDesc: 'Suggest save names',
      longDesc: 'Autogenerated naming suggestions for savegames',
      flag: 'auto_savenames'
    },
    {
      shortDesc: 'HP bar graphs',
      longDesc: 'Enable hit point bar graphs',
      flag: 'hpbargraphs'
    },
    {
      shortDesc: 'Fight Button L/R Swap',
      longDesc: 'Left button to attack, right button to pick up items',
      flag: 'mousebtswap'
    }
  ],
  lab: [],
  lastexpress: [],
  lilliput: [],
  lure: [
    {
      shortDesc: 'TTS Narrator',
      longDesc: 'Use TTS to read the descriptions (if TTS is available)',
      flag: 'tts_narrator'
    }
  ],
  macventure: [],
  made: [],
  mads: [
    {
      shortDesc: 'Easy mouse interface',
      longDesc: 'Shows object names when hovering the mouse over them',
      flag: 'EasyMouse'
    },
    {
      shortDesc: 'Animated inventory items',
      longDesc: 'Animated inventory items',
      flag: 'InvObjectsAnimated'
    },
    {
      shortDesc: 'Animated game interface',
      longDesc: 'Animated game interface',
      flag: 'TextWindowAnimated'
    },
    {
      shortDesc: 'Naughty game mode',
      longDesc: 'Naughty game mode',
      flag: 'NaughtyMode'
    },
    {
      shortDesc: 'Graphics dithering',
      longDesc: 'Graphics dithering',
      flag: 'GraphicsDithering'
    },
    {
      shortDesc: 'TTS Narrator',
      longDesc: 'Use TTS to read the descriptions (if TTS is available)',
      flag: 'tts_narrator'
    }
  ],
  mohawk: [],
  mortevielle: [],
  mutationofjb: [],
  myst3: [
    {
      shortDesc: 'Widescreen mod',
      longDesc: 'Enable widescreen rendering in fullscreen mode.',
      flag: 'widescreen_mod'
    }
  ],
  nancy: [],
  neverhood: [],
  ngi: [],
  parallaction: [],
  pegasus: [],
  petka: [],
  pink: [],
  plumbers: [],
  prince: [],
  private: [],
  queen: [
    {
      shortDesc: 'Alternative intro',
      longDesc: 'Use an alternative game intro (CD version only)',
      flag: 'alt_intro'
    }
  ],
  saga: [],
  sci: [
    {
      shortDesc: 'Skip EGA dithering pass (full color backgrounds)',
      longDesc: 'Skip dithering pass in EGA games, graphics are shown with full colors',
      flag: 'disable_dithering'
    },
    {
      shortDesc: 'Enable high resolution graphics',
      longDesc: 'Enable high resolution graphics/content',
      flag: 'enable_high_resolution_graphics'
    },
    {
      shortDesc: 'Enable black-lined video',
      longDesc: 'Draw black lines over videos to increase their apparent sharpness',
      flag: 'enable_black_lined_video'
    },
    {
      shortDesc: 'Use high-quality video scaling',
      longDesc: 'Use linear interpolation when upscaling videos, where possible',
      flag: 'enable_hq_video'
    },
    {
      shortDesc: 'Use high-quality \\"LarryScale\\" cel scaling',
      longDesc: 'Use special cartoon scaler for drawing character sprites',
      flag: 'enable_larryscale'
    },
    {
      shortDesc: 'Prefer digital sound effects',
      longDesc: 'Prefer digital sound effects instead of synthesized ones',
      flag: 'prefer_digitalsfx'
    },
    {
      shortDesc: 'Use original save/load screens',
      longDesc: 'Use the original save/load screens instead of the ScummVM ones',
      flag: 'originalsaveload'
    },
    {
      shortDesc: 'Use CD audio',
      longDesc: 'Use CD audio instead of in-game audio, if available',
      flag: 'use_cdaudio'
    },
    {
      shortDesc: 'Use Windows cursors',
      longDesc: 'Use the Windows cursors (smaller and monochrome) instead of the DOS ones',
      flag: 'windows_cursors'
    },
    {
      shortDesc: 'Use silver cursors',
      longDesc: 'Use the alternate set of silver cursors instead of the normal golden ones',
      flag: 'silver_cursors'
    },
    {
      shortDesc: 'Enable content censoring',
      longDesc: "Enable the game's built-in optional content censoring",
      flag: 'enable_censoring'
    },
    {
      shortDesc: 'Upscale videos',
      longDesc: 'Upscale videos to double their size',
      flag: 'enable_video_upscale'
    },
    {
      shortDesc: 'Use RGB rendering',
      longDesc: 'Use RGB rendering to improve screen transitions',
      flag: 'rgb_rendering'
    },
    {
      shortDesc: 'Use per-resource modified palettes',
      longDesc: 'Use custom per-resource palettes to improve visuals',
      flag: 'palette_mods'
    },
    {
      shortDesc: 'MIDI mode:',
      longDesc: 'When using external MIDI devices (e.g. through USB-MIDI), select your device here',
      flag: 'midi_mode'
    }
  ],
  scumm: [],
  sherlock: [
    {
      shortDesc: 'Use original save/load screens',
      longDesc: 'Use the original save/load screens instead of the ScummVM ones',
      flag: 'originalsaveload'
    },
    {
      shortDesc: 'Pixellated scene transitions',
      longDesc: 'When changing scenes, a randomized pixel transition is done',
      flag: 'fade_style'
    },
    {
      shortDesc: "Don't show hotspots when moving mouse",
      longDesc: 'Only show hotspot names after you actually click on a hotspot or action button',
      flag: 'help_style'
    },
    {
      shortDesc: 'Show character portraits',
      longDesc: 'Show portraits for the characters when conversing',
      flag: 'portraits_on'
    },
    {
      shortDesc: 'Slide dialogs into view',
      longDesc: 'Slide UI dialogs into view, rather than simply showing them immediately',
      flag: 'window_style'
    },
    {
      shortDesc: 'Transparent windows',
      longDesc: 'Show windows with a partially transparent background',
      flag: 'transparent_windows'
    },
    {
      shortDesc: 'TTS Narrator',
      longDesc: 'Use TTS to read the descriptions (if TTS is available)',
      flag: 'tts_narrator'
    }
  ],
  sky: [],
  sludge: [],
  stark: [
    {
      shortDesc: 'Load modded assets',
      longDesc: 'Enable loading of external replacement assets.',
      flag: 'enable_assets_mod'
    },
    {
      shortDesc: 'Enable linear filtering of the backgrounds images',
      longDesc: 'When linear filtering is enabled the background graphics are smoother in full screen mode, at the cost of some details.',
      flag: 'use_linear_filtering'
    },
    {
      shortDesc: 'Enable font anti-aliasing',
      longDesc: 'When font anti-aliasing is enabled, the text is smoother.',
      flag: 'enable_font_antialiasing'
    }
  ],
  startrek: [],
  supernova: [
    {
      shortDesc: 'Improved mode',
      longDesc: 'Removes some repetitive actions, adds possibility to change verbs by keyboard',
      flag: 'improved'
    }
  ],
  sword1: [],
  sword2: [],
  sword25: [],
  teenagent: [],
  testbed: [],
  tinsel: [],
  titanic: [],
  toltecs: [],
  tony: [],
  toon: [],
  touche: [],
  tsage: [],
  tucker: [],
  twine: [],
  voyeur: [],
  wage: [],
  wintermute: [
    {
      shortDesc: 'Show FPS-counter',
      longDesc: 'Show the current number of frames per second in the upper left corner',
      flag: 'show_fps'
    },
    {
      shortDesc: 'Sprite bilinear filtering (SLOW)',
      longDesc: 'Apply bilinear filtering to individual sprites',
      flag: 'bilinear_filtering'
    }
  ],
  xeen: [
    {
      shortDesc: 'Show item costs in standard inventory mode',
      longDesc: 'Shows item costs in standard inventory mode, allowing the value of items to be compared',
      flag: 'ShowItemCosts'
    },
    {
      shortDesc: 'More durable armor',
      longDesc: "Armor won't break until character is at -80HP, rather than merely -10HP",
      flag: 'DurableArmor'
    }
  ],
  zvision: []
};
