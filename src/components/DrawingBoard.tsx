import { useEffect, useRef, useState } from 'react';
import { Box, Select, useBreakpointValue } from '@chakra-ui/react';
import { Stage, Layer, Line, Text } from 'react-konva';
import { useActiveWallet } from 'thirdweb/react';
import GamePeer, { GameState } from '../GamePeer';

function DrawingBoard() {
  const wallet = useActiveWallet();
  const canvasSize = useBreakpointValue({ base: 300, md: 400, lg: 600 }) || 600

  //////// Drawing ////////
  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState<any[]>([]);
  const isDrawing = useRef(false);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine: any = lines[lines.length - 1];

    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  //////// P2P ////////
  const [gamePeer, setGamePeer] = useState<GamePeer | null>(null);
  const [gameState, setGameState] = useState<GameState>({ currentDrawer: '', word: '', scores: {} });
  const [guess, setGuess] = useState('');

  useEffect(() => {
    const account = wallet?.getAccount();
    if(!account) return

    const userId = `user_${account.address}`;
    console.log(userId)
    const peer = new GamePeer(userId, setGameState);
    setGamePeer(peer);

    // Join a room (in a real app, you'd get this from a lobby system)
    peer.joinRoom('user_0x35d389B751943Cbf3fE3620a668566E97D5f0144');

    // Listen for drawing updates from other peers
    peer.onDrawingUpdate((newLines: any[]) => {
      setLines(newLines);
    });

    return () => {
      peer.disconnect();
    };
  }, [wallet]);

  // Send drawing updates to other peers
  useEffect(() => {
    if (gamePeer && gameState.currentDrawer === gamePeer.getUserId()) {
      gamePeer.sendDrawing(lines);
    }
  }, [lines, gamePeer, gameState.currentDrawer]);
  
  return (
    <Box bg="white" borderRadius="md" boxShadow="md" p={4}>
      <Stage
        width={canvasSize}
        height={Math.round(canvasSize * 0.67)}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          <Text text="Draw XXX" />
          {lines.map((line: any, i: number) => (
            <Line
              key={i}
              points={line.points}
              stroke="#df4b26"
              strokeWidth={line.tool === 'eraser' ? 25 : 5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}
        </Layer>
      </Stage>
      <Select
        variant={'ghost'}
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}
      >
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
      </Select>
    </Box>
  );
};

export default DrawingBoard;
