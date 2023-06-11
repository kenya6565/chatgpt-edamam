import { useState } from 'react';
import theme from '../src/theme';
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  ThemeProvider,
} from '@mui/material';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const Chat = () => {
  const [userMessages, setUserMessages] = useState<Message[]>([]);
  const [assistantMessages, setAssistantMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  // declare this method is asynchronous by async
  const sendMessage = async () => {
    const userMessage: Message = { role: 'user', content: input };

    // Send user message to server(chat.ts)
    // waiting until getting response
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage.content }),
    });

    // convert json type
    const data = await res.json();

    const assistantMessage: Message = {
      role: 'assistant',
      content: data.chat.choices[0].text.trim(),
    };

    // Add user message to the user chat
    setUserMessages([...userMessages, userMessage]);

    // Add assistant message to the assistant chat
    setAssistantMessages([...assistantMessages, assistantMessage]);

    // Add Qiita articles to the assistant chat
    data.articles.forEach((article: any) => {
      const articleMessage: Message = {
        role: 'assistant',
        content: `Title: ${article.title}, URL: ${article.url}`,
      };
      setAssistantMessages((prevMessages) => [...prevMessages, articleMessage]);
    });

    // Clear input field
    setInput('');
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          どのような記事をお探しですか？
        </Typography>
        <List>
          {userMessages.map((message, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={message.role}
                secondary={message.content}
              />
            </ListItem>
          ))}
          {assistantMessages.map((message, index) => (
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
