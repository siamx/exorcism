# Exorcism

> Evict ghosts from your desktop, liberate you backgorund

[![Build Status](https://travis-ci.com/seyamx/exorcism.svg?branch=master)](https://travis-ci.com/seyamx/exorcism)

Cross platform wallpaper manager build using [Quasar Framework](https://quasar.dev/)

1. [Installation](#installation)
2. [Features](#features)
3. [Known Issues](#known-issues)
4. [Roadmap](#roadmap)
5. [FAQ](#faq)

## Installation
#### Binaries
Check out [releases page](https://github.com/seyamx/exorcism/releases)

#### Build it yourself
```bash
git clone https://github.com/seyamx/exorcism
cd exorcism
yarn
yarn build # this will build only for your platform
```

## Features
- Changes Wallpaper every 10 mins
- Download a new wallpaper every 10 mins
- Download locations is hardcoded to [Unsplash API](https://source.unsplash.com/)

## Know Issues
- Tray icon code design & implementation is the worst possible.
- When deleting an image make sure it's not in-use, or your background will go pitch black.

## Roadmap
- Add user settings
- Fix reported bugs
- Add more bugs to be fixed later

## FAQ
#### 1. Something is missing? Need a feature? Found a bug?
- Kindly open an issue :smile:

#### 2. Want to give a helping hand?
Refer to [Quasar Docs](https://quasar.dev/start/pick-quasar-flavour), and dive
```bash
git clone https://github.com/seyamx/exorcism
cd exorcism
yarn
yarn dev
```
