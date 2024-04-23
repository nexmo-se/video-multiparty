# Multiparty with JS SDK

## Running the app

### Runing client side only

1. Install dependencies `npm install`
2. Replace credentials in `Context/session.jsx`
3. Run `dev:frontend`
4. Visit `http://localhost:5173/`

### Running the entire app (server included)

Prerequisites.
Install the [vcr CLI](https://github.com/Vonage/cloud-runtime-cli/blob/main/README.md)

1. Run vcr configure to set your $API_KEY and $API_SECRET
2. Run vcr app create --name "vcr-video-app" and copy application id (only if you don't have an app yet)
3. Fill out `vcr.yml` with your application Id
4. Install dependencies on the client and server side
5. Create the production build `npm run build`
6. Deploy it `neru deploy`
