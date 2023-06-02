import { useState } from 'react';
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { grey } from '@mui/material/colors';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const userMessage: Message = { role: 'user', content: input };

    // Send user message to server
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage.content }),
    });

    const data = await res.json();

    const assistantMessage: Message = {
      role: 'assistant',
      content: data.response,
    };

    // Add user and assistant messages to the chat
    setMessages([...messages, userMessage, assistantMessage]);

    // Clear input field
    setInput('');
  };

  const theme = createTheme({
    palette: {
      mode: 'dark', // 'type' has been replaced with 'mode' in Material-UI 5
      primary: {
        main: grey[50], // This will be the color of the text in dark mode
      },
      background: {
        default: grey[900], // This will be the color of the background in dark mode
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '& fieldset': {
              borderColor: grey[50],
            },
            '&.Mui-focused fieldset': {
              borderColor: grey[50],
            },
          },
          input: {
            color: grey[50], // This will be the color of the TextField text in dark mode
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Chatbot
        </Typography>
        <List>
          {messages.map((message, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={message.role}
                secondary={message.content}
              />
            </ListItem>
          ))}
        </List>
        <div style={{ display: 'flex', marginTop: '20px' }}>
          <TextField
            fullWidth
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            style={{ marginLeft: '10px' }}
          >
            Send
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Chat;
