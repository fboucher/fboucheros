# FBoucheros - Personal Content Hub 🌐

[![Live Site](https://img.shields.io/badge/Live_Site-fboucheros.com-5d6d7e?style=for-the-badge)](https://fboucheros.com)

A modern, multilingual personal website serving as a central hub for Frank Boucher's technical content, spanning cloud computing, AI, .NET development, and DevOps across multiple platforms and languages.

## 🎯 About This Project

This repository contains a **static HTML/CSS/JavaScript website** that aggregates and presents content from multiple sources in both **English and French**. It serves as the central hub for Frank Boucher's technical content creation activities, including:

- 📝 **Blog Posts** from multiple personal blogs
- 🎥 **YouTube Videos** from different channels
- 🎙️ **Podcast Appearances** and collaborations
- 📖 **Professional Biography** in multiple formats
- 🌐 **Multilingual Content** organization

## ✨ Key Features

### 📡 Real-time Content Aggregation
- **RSS Feed Integration**: Automatically pulls latest content from:
  - [Franky's Notes](https://www.frankysnotes.com) (English blog)
  - [Cloud en Français](https://www.cloudenfrancais.com) (French blog)
  - Multiple YouTube channels
  - Guest appearances and collaborations

### 📱 Social Media Integration
- Direct links to GitHub, Twitter/X, LinkedIn, Instagram, BlueSky, and YouTube
- Consistent branding across all platforms
- Professional networking facilitation

## 🎤 Adding a Talk

The [Talks page](https://fboucheros.com/talks.html) is built from [`talks.json`](talks.json). To add a talk, add an object to the array (any position works, the page sorts by date):

```json
{
  "date": "2027-03-19",
  "event": "Warsaw IT Days",
  "title": "My new talk",
  "url": "https://example.com/session"
}
```

- `date`: `YYYY-MM-DD`. Talks dated today or later are listed as upcoming.
- `event`: conference or meetup name.
- `title`: talk title.
- `url`: optional link to the recording, slides, or event. Use `null` if there is none.

An entry with an invalid date, or without an event or title, is skipped (see the browser console). To preview locally, serve the folder with a static server (e.g. `python -m http.server`); opening the file directly won't load the JSON.

## 🗂️ Content Sources

### English Content
| Source | Type | Description |
|--------|------|-------------|
| [Franky's Notes](https://www.frankysnotes.com) | Blog | Personal insights, tutorials, cloud computing, AI, and weekly Reading Notes |
| [Frank Boucher YouTube](https://youtube.com/@fboucheros) | Videos | Technical tutorials, demos, and cloud technology content |
| [Behind my Cloud](https://youtube.com/@behindmycloud) | Live Streams | Twitch and YouTube live streams |
| External Collaborations | Playlist | Guest appearances on other channels and podcasts |

### French Content
| Source | Type | Description |
|--------|------|-------------|
| [Cloud en Français](https://www.cloudenfrancais.com) | Blog | French blog dedicated to cloud computing, AI, .NET, and Microsoft technologies |
| [Cloud en Français YouTube](https://youtube.com/@CloudEnFrancais) | Videos | French tutorials, demos, and technical content |
| External Collaborations (FR) | Playlist | French podcast and channel appearances |
