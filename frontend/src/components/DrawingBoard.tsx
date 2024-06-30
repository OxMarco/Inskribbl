import { useEffect, useRef, useState } from 'react';
import { Box, Select, useBreakpointValue, useToast } from '@chakra-ui/react';
import { Stage, Layer, Line, Text } from 'react-konva';
import Peer, { DataConnection } from 'peerjs';

function DrawingBoard({ host, address, word, setPlayers }: { host: string, address: string, word: string | undefined, setPlayers: (addr: string) => void }) {
  const canvasSize = useBreakpointValue({ base: 300, md: 400, lg: 600 }) || 600
  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState<any[]>([]);
  const isDrawing = useRef(false);
  const [peer, setPeer] = useState<Peer>();
  const [remotePeers, setRemotePeers] = useState<string[]>([]);
  const [connection, setConnection] = useState<DataConnection>()
  const [connections, setConnections] = useState<DataConnection[]>([])
  const toast = useToast()

  //////// P2P ////////
  const isHost = (id: string) => {
    return id === 'peer_' + host;
  }

  useEffect(() => {
    if (!address) return

    const userId = `peer_${address}`;
    const newPeer = new Peer(userId, {
      host: '0.peerjs.com',
      port: 443,
      path: '/',
      pingInterval: 500,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ]
      }
    });

    newPeer.on('open', (id: string) => {
      setPeer(newPeer)

      if (!isHost(id)) {
        const conn = newPeer.connect('peer_' + host)

        conn.on('open', () => {
          setConnection(conn)
        });

        conn.on('error', (err: any) => {
          toast({
            status: 'error',
            title: 'Connection error, reload the page',
            description: err,
            isClosable: true,
          })
        });
      }
    });

    newPeer.on('connection', (connection) => {
      setConnections([...connections, connection]);
      setRemotePeers([...remotePeers, connection.peer])
    });

    newPeer.on('error', (err) => {
      console.error('Peer connection error:', err);
    });

    return () => {
      newPeer.destroy();
    };
  }, []);

  useEffect(() => {
    remotePeers.map((user) => {
      const cleanupId = user.replace('peer_', '');
      setPlayers(cleanupId)
    })
  }, [remotePeers])

  useEffect(() => {
    if (!peer || !connection || isHost(peer.id)) return

    connection.on('data', function (msg: any) {
      if(msg.type == 'lines') {
        setLines(msg.data)
      } else {
        setRemotePeers(msg.data)
      }
    });

    return () => {
      if (connection) connection.close();
    };
  }, [connection])

  useEffect(() => {
    if (!peer || connections.length == 0) return

    if (isHost(peer.id)) {
      connections.map((conn) => conn.send({ type: 'lines', data: lines }))
    }

  }, [connections, lines])

  useEffect(() => {
    if (!peer || connections.length == 0) return

    if (isHost(peer.id)) {
      connections.map((conn) => conn.send({ type: 'peers', data: remotePeers }))
    }

  }, [connections, remotePeers])

  //////// Drawing ////////
  const canDraw = (): boolean => {
    if (!peer) return false;
    return isHost(peer.id);
  }

  const handleMouseDown = (e: any) => {
    if (!canDraw()) return;

    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: any) => {
    if (!canDraw()) return;

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
    if (!canDraw()) return;

    isDrawing.current = false;
  };

  return (
    <Box bg='white' borderRadius='md' boxShadow='md' p={4}>
      <Stage
        width={canvasSize}
        height={Math.round(canvasSize * 0.67)}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          {word && <Text text={`Draw ${word}`} />}
          {lines.map((line: any, i: number) => (
            <Line
              key={i}
              points={line.points}
              stroke='#df4b26'
              strokeWidth={line.tool === 'eraser' ? 25 : 5}
              tension={0.5}
              lineCap='round'
              lineJoin='round'
              globalCompositeOperation={
                line.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}
        </Layer>
      </Stage>
      {canDraw() && <Select
        variant={'ghost'}
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}
      >
        <option value='pen'>Pen</option>
        <option value='eraser'>Eraser</option>
      </Select>}
    </Box>
  );
};

export default DrawingBoard;
