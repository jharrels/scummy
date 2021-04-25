generalGameOptions = {
    "graphics": [
      {"type": "list", "label": "Graphics Mode", "flag": "gfx_mode", "values": [
        {"value": "default", "text": "<default>"},
        {"value": "2x", "text": "2X"},
        {"value": "3x", "text": "3X"},
        {"value": "2xsai", "text": "2xSAI"},
        {"value": "super2xsai", "text": "Super2xSAI"},
        {"value": "supereagle", "text": "SuperEagle"},
        {"value": "advmame2x", "text": "AdvMAME2x"},
        {"value": "advmame3x", "text": "AdvMAME3x"},
        {"value": "hq2x", "text": "HQ2x"},
        {"value": "hq3x", "text": "HQ3x"},
        {"value": "tv2x", "text": "TV2x"},
        {"value": "dotmatrix", "text": "DotMatrix"},
        {"value": "opengl", "text": "OpenGL"}
      ]},
      {"type": "list", "label": "Render Mode", "flag": "render_mode", "values": [
        {"value": "default", "text": "<default>"},
        {"value": "hercGreen", "text": "Hercules Green"},
        {"value": "hercAmber", "text": "Hercules Amber"},
        {"value": "cga", "text": "CGA"},
        {"value": "ega", "text": "EGA"},
        {"value": "vga", "text": "VGA"},
        {"value": "amiga", "text": "Amiga"},
        {"value": "fmtowns", "text": "FM-TOWNS"},
        {"value": "pc9821", "text": "PC-9821 (256 Colors)"},
        {"value": "pc9801", "text": "PC-9801 (16 Colors)"},
        {"value": "2gs", "text": "Apple IIgs"},
        {"value": "atari", "text": "Atari ST"},
        {"value": "macintosh", "text": "Macintosh"}
      ]},
      {"type": "list", "label": "Stretch Mode", "flag": "stretch_mode", "values": [
        {"value": "default", "text": "<default>"},
        {"value": "center", "text": "Center"},
        {"value": "pixel-perfect", "text": "Pixel-perfect scaling"},
        {"value": "fit", "text": "Fit to window"},
        {"value": "stretch", "text": "Stetch to window"},
        {"value": "fit_force_aspect", "text": "Fit to window (4:3)"}
      ]},
      {"type": "bool", "label": "Aspect Ratio Correction", "flag": "aspect_ratio"},
      {"type": "bool", "label": "Fullscreen mode", "flag": "fullscreen"},
      {"type": "bool", "label": "Filter Graphics", "flag": "filtering"}
    ],
    "audio": [
      {"type": "nlst", "label": "Music Device", "flag": "music_driver", "source": "list-audio-drivers"},
      {"type": "list", "label": "Adlib Emulator", "flag": "opl_driver", "values": [
        {"value": "default", "text": "<default>"},
        {"value": "mame", "text": "MAME OPL Emulator"},
        {"value": "db", "text": "DOSBox OPL Emulator"},
        {"value": "nuked", "text": "Nuked OPL Emulator"},
        {"value": "opl2lpt", "text": "OPL2LPT"},
        {"value": "opl3lpt", "text": "OPL3LPT"}
      ]},
      {"type": "bool", "label": "Speech", "flag": "speech_mute", "mode": "invert"},
      {"type": "bool", "label": "Subtitles", "flag": "subtitles"},
      {"type": "slid", "label": "Subtitle Speed", "flag": "talkspeed", "default": 60, "min": 0, "max": 255},
    ],
    "volume": [
      {"type": "slid", "label": "Music Volume", "flag": "music_volume", "default": 192, "min": 0, "max": 255},
      {"type": "slid", "label": "Sound Effects Volume", "flag": "sfx_volume", "default": 192, "min": 0, "max": 255},
      {"type": "slid", "label": "Speech Volume", "flag": "speech_volume", "default": 192, "min": 0, "max": 255},
    ],
    "paths": [
      {"type": "dir", "label": "Game Path", "flag": ""},
      {"type": "dir", "label": "Save Path", "flag": ""},
      {"type": "dir", "label": "Extra Path", "flag": ""},
    ]
  };
