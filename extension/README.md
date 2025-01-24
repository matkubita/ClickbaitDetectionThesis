# ClickGuard

Chrome extension for clickbait recognition in articles.

In order to run it:
- Download `/extension` folder from this repo
- Go to chrome extensions
- Turn on developer mode (top right corner)
- Click "Load unpacked" button (top left corner)
- Select folder with extension files and submit

Now ClickGuard will appear in the extensions popup. Go to any article, click on the extension icon and press "Check" button!

If external API is not available anymore, you can set it up locally. For detailed instructions for running the API head to the api section. 
To use the extension with local service, you need to change `PROXY_URL` constant in `background.js` file to local service URL. 
