# P2P Skribbl.io
We want to create a serverless, peer to peer version of 
the popular io game Skribbl, where multiple users try to guess what a user is drawing.
Created for [Base on-chain summer](https://base.mirror.xyz/iYQH5yxgH976gUmrYfoeyVpe5SJtiR8r2t10Psr1_-U).

## Architecture
The website will be hosted on IPFS, client-side rendered, leveraging WebRTC and peerjs 
to manage cross-client data streaming.

### Tech stack
Frontend: React and TypeScript
Peer-to-peer communication: WebRTC, peerjs
Hosting: IPFS

### Data Flow

When a user creates a game, they become the host peer.
Subsequent users connect to the host peer when joining the game.
The host peer manages game state and broadcasts updates to all connected peers.
Drawing data is streamed in real-time from the active drawer to all other peers.
Guesses are signed with the user wallet and sent to the host peer that validates them
using an on-chain commit-reveal scheme.

## Gameplay

Players take turns drawing a given word.
Non-drawing players attempt to guess the word based on the drawing.
Points are awarded for correct guesses, with earlier guesses earning more points.
The game proceeds through multiple rounds, with each player getting a chance to draw.

### Scoring

First correct guess: 100 points
Subsequent correct guesses: Decreasing points based on order
Points for the drawer: Based on how many players guess correctly
