generalGameOptions = {
    "graphics": [
      {"type": "list", "label": "Graphics Mode", "configEntry": "", "values": []},
      {"type": "list", "label": "Render Mode", "configEntry": "", "values": []},
      {"type": "list", "label": "Stretch Mode", "configEntry": "", "values": []},
      {"type": "bool", "label": "Aspect Ratio Correction", "configEntry": ""},
      {"type": "bool", "label": "Fullscreen mode", "configEntry": ""},
      {"type": "bool", "label": "Filter Graphics", "configEntry": ""}
    ]
  },
  {
    "audio": [
      {"type": "list", "label": "Music Device", "configEntry": "", "values": []},
      {"type": "list", "label": "Adlib Emulator", "configEntry": "", "values": []},
      {"type": "enum", "label": "Text and Speech", "configEntry": "", "values": []},
      {"type": "slid", "label": "Subtitle Speed", "configEntry": "", "default": 60, "min": 0, "max": 255},
    ]
  },
  {
    "volume": [
      {"type": "slid", "label": "Music Volume", "configEntry": "", "default": 192, "min": 0, "max": 255},
      {"type": "slid", "label": "Sound Effects Volume Emulator", "configEntry": "", "default": 192, "min": 0, "max": 255},
      {"type": "slid", "label": "Speech Volume", "configEntry": "", "default": 192, "min": 0, "max": 255},
    ]
  },
  {
    "paths": [
      {"type": "dir", "label": "Game Path", "configEntry": ""},
      {"type": "dir", "label": "Save Path", "configEntry": ""},
      {"type": "dir", "label": "Extra Path", "configEntry": ""},
    ]
  };
